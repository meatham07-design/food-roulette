import express, { Request, Response } from 'express';
import placesService from '../services/placesService';
import prisma from '../lib/prisma';

const router = express.Router();

/**
 * GET /api/restaurants/nearby
 * Search for nearby restaurants
 * Query params: lat, lng, radius (in meters), category (optional)
 */
router.get('/nearby', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const radius = parseInt(req.query.radius as string) || 1000; // Default 1km
    const categoryIdsParam = req.query.categoryIds as string | undefined;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Parse category IDs from comma-separated string
    const categoryIds = categoryIdsParam 
      ? categoryIdsParam.split(',').filter(id => id.trim().length > 0)
      : [];

    // Category mapping: Google Places API type and optional keyword
    const categoryMap: { [key: string]: { type: string; keyword?: string } } = {
      'restaurant': { type: 'restaurant' },
      'cafe': { type: 'cafe' },
      'bakery': { type: 'bakery' },
      'meal_takeaway': { type: 'meal_takeaway' },
      'meal_delivery': { type: 'meal_delivery' },
      'bar': { type: 'bar' },
      'pizza': { type: 'restaurant', keyword: 'pizza' },
      'italian': { type: 'restaurant', keyword: 'italian restaurant' },
      'chinese': { type: 'restaurant', keyword: 'chinese restaurant' },
      'japanese': { type: 'restaurant', keyword: 'japanese restaurant' },
      'korean': { type: 'restaurant', keyword: 'korean restaurant' },
      'mexican': { type: 'restaurant', keyword: 'mexican restaurant' },
      'indian': { type: 'restaurant', keyword: 'indian restaurant' },
      'thai': { type: 'restaurant', keyword: 'thai restaurant' },
      'turkish': { type: 'restaurant', keyword: 'turkish restaurant' },
      'fast_food': { type: 'restaurant', keyword: 'fast food' },
      'seafood': { type: 'restaurant', keyword: 'seafood restaurant' },
      'steak_house': { type: 'restaurant', keyword: 'steak house' },
      'vegetarian': { type: 'restaurant', keyword: 'vegetarian restaurant' },
      'vegan': { type: 'restaurant', keyword: 'vegan restaurant' },
    };

    // Search Google Places API
    // If categories selected, search for each category separately and combine results
    let allPlaces: any[] = [];
    
    if (categoryIds.length > 0) {
      // Search for each category separately
      const searchPromises = categoryIds.map(categoryId => {
        const categoryInfo = categoryMap[categoryId];
        if (categoryInfo) {
          return placesService.searchNearbyRestaurants(
            lat, 
            lng, 
            radius, 
            categoryInfo.type,
            categoryInfo.keyword
          );
        }
        // Fallback to restaurant if category not found
        return placesService.searchNearbyRestaurants(lat, lng, radius, 'restaurant');
      });
      const results = await Promise.all(searchPromises);
      
      // Combine all results and remove duplicates by place_id
      const placeIdMap = new Map();
      results.flat().forEach(place => {
        if (!placeIdMap.has(place.place_id)) {
          placeIdMap.set(place.place_id, place);
        }
      });
      allPlaces = Array.from(placeIdMap.values());
    } else {
      // No category filter, get all restaurants
      allPlaces = await placesService.searchNearbyRestaurants(lat, lng, radius);
    }

    // Save restaurants to database
    const savedRestaurants = await Promise.all(
      allPlaces.map(place => placesService.saveRestaurant(place))
    );

    // Calculate distances and format response
    const restaurants = savedRestaurants.map(restaurant => {
      const distance = placesService.calculateDistance(
        lat,
        lng,
        restaurant.latitude,
        restaurant.longitude
      );

      return {
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        distance: Math.round(distance), // in meters
        rating: restaurant.rating,
        priceLevel: restaurant.priceLevel,
        phone: restaurant.phone,
        website: restaurant.website,
        photos: restaurant.photos,
        placeId: restaurant.placeId,
      };
    });

    // Sort by distance
    restaurants.sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (error: any) {
    console.error('Error fetching nearby restaurants:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * GET /api/restaurants
 * Get restaurants from database with filters
 * Query params: lat, lng, radius, categoryId (optional)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
    const lng = req.query.lng ? parseFloat(req.query.lng as string) : undefined;
    const radius = req.query.radius ? parseInt(req.query.radius as string) : undefined;
    const categoryId = req.query.categoryId as string | undefined;

    let where: any = {};

    // Filter by category
    if (categoryId) {
      where.categories = {
        some: {
          categoryId: categoryId,
        },
      };
    }

    const restaurants = await prisma.restaurant.findMany({
      where,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    // Filter by distance if coordinates provided
    let filteredRestaurants = restaurants;
    if (lat && lng && radius) {
      filteredRestaurants = restaurants.filter(restaurant => {
        const distance = placesService.calculateDistance(
          lat,
          lng,
          restaurant.latitude,
          restaurant.longitude
        );
        return distance <= radius;
      });
    }

    // Format response with distance
    const formattedRestaurants = filteredRestaurants.map(restaurant => {
      const distance = lat && lng
        ? placesService.calculateDistance(lat, lng, restaurant.latitude, restaurant.longitude)
        : null;

      return {
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        distance: distance ? Math.round(distance) : null,
        rating: restaurant.rating,
        priceLevel: restaurant.priceLevel,
        phone: restaurant.phone,
        website: restaurant.website,
        photos: restaurant.photos,
        categories: restaurant.categories.map(rc => ({
          id: rc.category.id,
          name: rc.category.name,
        })),
      };
    });

    // Sort by distance if available
    if (lat && lng) {
      formattedRestaurants.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    res.json({
      success: true,
      count: formattedRestaurants.length,
      restaurants: formattedRestaurants,
    });
  } catch (error: any) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * GET /api/restaurants/:id
 * Get a single restaurant by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: req.params.id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({
      success: true,
      restaurant: {
        ...restaurant,
        categories: restaurant.categories.map(rc => ({
          id: rc.category.id,
          name: rc.category.name,
        })),
      },
    });
  } catch (error: any) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;

