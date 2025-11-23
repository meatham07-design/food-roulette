import express, { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import placesService from '../services/placesService';
import rouletteCache from '../services/rouletteCache';
import prisma from '../lib/prisma';

const router = express.Router();

/**
 * Filter restaurants to only include actual restaurants/food places
 * Excludes: jewelry_store, school, store, bank, etc.
 */
function filterRestaurantsOnly(restaurants: any[]): any[] {
  const validRestaurantCategories = [
    'Restoran', 'Kafe', 'Fırın', 'Paket Servis', 'Sipariş', 'Bar', 
    'Pizza', 'İtalyan', 'Çin', 'Japon', 'Kore', 'Meksika', 'Hint', 
    'Tayland', 'Türk', 'Fast Food', 'Deniz Ürünleri', 'Et Restoranı', 
    'Vejetaryen', 'Vegan'
  ];

  return restaurants.filter(restaurant => {
    // Eğer kategori varsa, geçerli kategorilerden birine sahip olmalı
    if (restaurant.categories && restaurant.categories.length > 0) {
      const categoryNames = restaurant.categories.map((rc: { category?: { name: string }; name?: string }) => 
        rc.category ? rc.category.name : (rc.name || '')
      );
      return categoryNames.some((catName: string) => validRestaurantCategories.includes(catName));
    }
    
    // Kategori yoksa, name'e bakarak kontrol et
    const name = restaurant.name?.toLowerCase() || '';
    const restaurantKeywords = [
      'restoran', 'restaurant', 'cafe', 'café', 'cafeteria', 'bistro', 
      'diner', 'eatery', 'food', 'yemek', 'lokanta', 'meyhane', 'bar', 
      'pub', 'pizzeria', 'trattoria', 'taverna', 'bakery', 'fırın', 
      'pastane', 'pastry', 'baker', 'kahve', 'coffee', 'espresso',
      'pizza', 'burger', 'hamburger', 'döner', 'kebap', 'kebab',
      'lahmacun', 'pide', 'mantı', 'börek', 'çorba', 'soup'
    ];
    const excludedKeywords = [
      'kuyumcu', 'jewelry', 'okul', 'school', 'üniversite', 'university', 
      'market', 'supermarket', 'banka', 'bank', 'eczane', 'pharmacy', 
      'hastane', 'hospital', 'clinic', 'klinik', 'doktor', 'doctor', 
      'diş', 'dentist', 'eczacı', 'pharmacist', 'oto', 'car', 'araç',
      'benzin', 'gas', 'petrol', 'akaryakıt', 'oto yıkama', 'car wash',
      'oto tamir', 'car repair', 'oto galeri', 'car dealer'
    ];
    
    const hasRestaurantKeyword = restaurantKeywords.some((keyword: string) => name.includes(keyword));
    const hasExcludedKeyword = excludedKeywords.some((keyword: string) => name.includes(keyword));
    
    return hasRestaurantKeyword && !hasExcludedKeyword;
  });
}

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
    // Her kategori için ayrı arama yapıldığında, her aramadan maksimum 60 sonuç alınabilir
    // Bu sayede toplam sonuç sayısı kategori sayısı × 60'a kadar çıkabilir
    let allPlaces: any[] = [];
    
    if (categoryIds.length > 0) {
      // Her kategori için ayrı arama yap (her biri maksimum 60 sonuç döndürebilir)
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
      
      // Tüm sonuçları birleştir ve duplicate'leri place_id'ye göre kaldır
      const placeIdMap = new Map();
      results.flat().forEach(place => {
        if (!placeIdMap.has(place.place_id)) {
          placeIdMap.set(place.place_id, place);
        }
      });
      allPlaces = Array.from(placeIdMap.values());
      
      console.log(`Total unique places found: ${allPlaces.length} (from ${categoryIds.length} category searches)`);
    } else {
      // Kategori filtresi yok, tüm restoranları al (maksimum 60 sonuç)
      allPlaces = await placesService.searchNearbyRestaurants(lat, lng, radius);
      console.log(`Total places found: ${allPlaces.length}`);
    }

    // Save restaurants to database
    const savedRestaurants = await Promise.all(
      allPlaces.map(place => placesService.saveRestaurant(place))
    );

    // Filter to only include actual restaurants (double-check after saving)
    const filteredRestaurants = filterRestaurantsOnly(savedRestaurants);

    // Calculate distances and format response
    const restaurants = filteredRestaurants.map(restaurant => {
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

    // TÜM RESTORANLARI DÖNDÜR - Frontend'de allRestaurants'ta tutulacak
    // Frontend rastgele 30 tanesini seçip çarka koyacak
    // Karıştır butonu ile allRestaurants'tan tekrar rastgele 30 tane seçilecek
    console.log(`📤 Sending ${restaurants.length} restaurants to frontend (allRestaurants)`);
    
    res.json({
      success: true,
      count: restaurants.length,
      totalFound: restaurants.length,
      restaurants: restaurants, // TÜM restoranlar - frontend'de allRestaurants olarak tutulacak
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

    // Filter to only include actual restaurants (exclude jewelry stores, schools, etc.)
    const filteredByType = filterRestaurantsOnly(restaurants);

    // Filter by distance if coordinates provided
    let filteredRestaurants = filteredByType;
    if (lat && lng && radius) {
      filteredRestaurants = filteredByType.filter(restaurant => {
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
        categories: restaurant.categories.map((rc: any) => ({
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
 * GET /api/restaurants/roulette
 * Get random restaurants for roulette wheel with weighted sampling
 * Query params: lat, lng, radius, limit (default 30), sessionId
 * 
 * IMPORTANT: This route must be defined BEFORE /:id route
 * Otherwise Express will match /roulette as /:id
 */
router.get('/roulette', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const radius = parseInt(req.query.radius as string) || 5000; // Default 5km
    const limit = parseInt(req.query.limit as string) || 30; // Default 30
    const sessionId = (req.query.sessionId as string) || `session_${Date.now()}_${Math.random()}`;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // No excludedIds - completely random selection from all restaurants

    // Geospatial query - get ALL restaurants within radius (no exclusions)
    const allRestaurantsFromDb = await prisma.restaurant.findMany({
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    // Calculate distance and filter by radius
    const allRestaurants = allRestaurantsFromDb
      .map(restaurant => {
        const distance = placesService.calculateDistance(
          lat,
          lng,
          restaurant.latitude,
          restaurant.longitude
        );
        return {
          ...restaurant,
          distance,
        };
      })
      .filter(restaurant => restaurant.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    // Calculate remaining count (before filtering by rating if needed)
    const remainingCount = allRestaurants.length;

    if (remainingCount === 0) {
      return res.status(200).json({
        success: true,
        restaurants: [],
        remainingCount: 0,
        message: 'Filtreyi değiştirin - Bu kriterlere uygun başka restoran kalmadı.',
      });
    }

    // Weighted random sampling based on rating
    // Higher rating = higher weight, but still random
    const weightedRestaurants = allRestaurants.map(restaurant => {
      // Weight calculation: rating * 0.3 + distance_weight * 0.7
      // Distance weight: closer = higher weight (inverse of normalized distance)
      const maxDistance = radius;
      const distanceWeight = 1 - (restaurant.distance / maxDistance);
      
      // Rating weight: higher rating = higher weight (normalize 0-5 to 0-1)
      const ratingWeight = restaurant.rating ? restaurant.rating / 5 : 0.3; // Default 0.3 if no rating
      
      // Combined weight: 40% rating, 60% distance
      const weight = (ratingWeight * 0.4) + (distanceWeight * 0.6);
      
      return {
        ...restaurant,
        weight: weight,
      };
    });

    // Sort by weight (descending) and take top candidates
    weightedRestaurants.sort((a, b) => b.weight - a.weight);
    
    // Take top 3x limit candidates for better randomness
    const candidates = weightedRestaurants.slice(0, Math.min(limit * 3, weightedRestaurants.length));
    
    // Randomly select from top candidates
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(limit, shuffled.length));

    // Format response
    const formattedRestaurants = selected.map(restaurant => ({
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      distance: Math.round(restaurant.distance),
      rating: restaurant.rating,
      priceLevel: restaurant.priceLevel,
      phone: restaurant.phone,
      website: restaurant.website,
      photos: restaurant.photos,
      placeId: restaurant.placeId,
      categories: restaurant.categories?.map((rc: any) => ({
        id: rc.category.id,
        name: rc.category.name,
      })) || [],
    }));

    res.json({
      success: true,
      restaurants: formattedRestaurants,
      remainingCount: remainingCount,
      count: formattedRestaurants.length,
      sessionId: sessionId, // Return sessionId so frontend can use it
    });
  } catch (error: any) {
    console.error('Error in roulette endpoint:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * POST /api/restaurants/roulette/shuffle
 * Get completely random 30 restaurants (no exclusions, can repeat)
 * Body: { lat, lng, radius, limit = 30 }
 */
router.post('/roulette/shuffle', async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius, limit = 30 } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Get ALL restaurants within radius (no exclusions - completely random)
    // Geospatial query - get ALL restaurants within radius (no exclusions)
    const allRestaurantsFromDb = await prisma.restaurant.findMany({
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    // Filter to only include actual restaurants (exclude jewelry stores, schools, etc.)
    const filteredRestaurantsFromDb = filterRestaurantsOnly(allRestaurantsFromDb);

    // Calculate distance and filter by radius
    const allRestaurants = filteredRestaurantsFromDb
      .map(restaurant => {
        const distance = placesService.calculateDistance(
          lat,
          lng,
          restaurant.latitude,
          restaurant.longitude
        );
        return {
          ...restaurant,
          distance,
        };
      })
      .filter(restaurant => restaurant.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    const remainingCount = allRestaurants.length;

    if (remainingCount === 0) {
      return res.status(200).json({
        success: true,
        restaurants: [],
        remainingCount: 0,
        message: 'Filtreyi değiştirin - Bu kriterlere uygun başka restoran kalmadı.',
      });
    }

    // Weighted random sampling
    const weightedRestaurants = allRestaurants.map(restaurant => {
      const maxDistance = radius;
      const distanceWeight = 1 - (restaurant.distance / maxDistance);
      const ratingWeight = restaurant.rating ? restaurant.rating / 5 : 0.3;
      const weight = (ratingWeight * 0.4) + (distanceWeight * 0.6);
      
      return {
        ...restaurant,
        weight: weight,
      };
    });

    weightedRestaurants.sort((a, b) => b.weight - a.weight);
    const candidates = weightedRestaurants.slice(0, Math.min(limit * 3, weightedRestaurants.length));
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(limit, shuffled.length));

    const formattedRestaurants = selected.map(restaurant => ({
      id: restaurant.id,
      name: restaurant.name,
      address: restaurant.address,
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      distance: Math.round(restaurant.distance),
      rating: restaurant.rating,
      priceLevel: restaurant.priceLevel,
      phone: restaurant.phone,
      website: restaurant.website,
      photos: restaurant.photos,
      placeId: restaurant.placeId,
      categories: restaurant.categories?.map((rc: any) => ({
        id: rc.category.id,
        name: rc.category.name,
      })) || [],
    }));

    res.json({
      success: true,
      restaurants: formattedRestaurants,
      remainingCount: remainingCount, // Total count of all restaurants
      count: formattedRestaurants.length,
    });
  } catch (error: any) {
    console.error('Error in roulette shuffle endpoint:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

/**
 * GET /api/restaurants/:id
 * Get a single restaurant by ID
 * IMPORTANT: This route must be defined AFTER /roulette route
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

