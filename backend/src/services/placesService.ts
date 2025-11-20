import axios from 'axios';
import prisma from '../lib/prisma';

interface GooglePlace {
  place_id: string;
  name: string;
  vicinity?: string;
  formatted_address?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  price_level?: number;
  types?: string[];
  photos?: Array<{ photo_reference: string }>;
  international_phone_number?: string;
  website?: string;
}

interface PlacesSearchResponse {
  results: GooglePlace[];
  status: string;
}

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

export class PlacesService {
  /**
   * Search for nearby restaurants using Google Places API
   */
  async searchNearbyRestaurants(
    latitude: number,
    longitude: number,
    radius: number = 1000, // in meters
    categoryType?: string, // Google Places type (e.g., 'cafe', 'restaurant', etc.)
    keyword?: string // Optional keyword for more specific searches (e.g., 'pizza', 'italian restaurant')
  ): Promise<GooglePlace[]> {
    if (!GOOGLE_PLACES_API_KEY) {
      throw new Error('GOOGLE_PLACES_API_KEY is not configured');
    }

    const url = `${GOOGLE_PLACES_BASE_URL}/nearbysearch/json`;
    const params: any = {
      location: `${latitude},${longitude}`,
      radius: radius,
      key: GOOGLE_PLACES_API_KEY,
    };

    // If category type specified, use it; otherwise default to 'restaurant'
    if (categoryType) {
      params.type = categoryType;
    } else {
      params.type = 'restaurant';
    }

    // Add keyword if provided (for more specific searches like 'pizza', 'italian restaurant')
    if (keyword) {
      params.keyword = keyword;
    }

    try {
      const response = await axios.get<PlacesSearchResponse>(url, { params });

      if (response.data.status === 'OK' || response.data.status === 'ZERO_RESULTS') {
        return response.data.results || [];
      } else {
        throw new Error(`Google Places API error: ${response.data.status}`);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
      throw error;
    }
  }

  /**
   * Get photo URL from Google Places
   */
  getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
    if (!GOOGLE_PLACES_API_KEY) {
      return '';
    }
    return `${GOOGLE_PLACES_BASE_URL}/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
  }

  /**
   * Save or update restaurant in database
   */
  async saveRestaurant(place: GooglePlace): Promise<any> {
    const address = place.vicinity || place.formatted_address || '';
    const photoUrls = place.photos?.slice(0, 3).map(photo =>
      this.getPhotoUrl(photo.photo_reference)
    ) || [];

    // Map Google types to our categories
    const categoryNames = this.mapGoogleTypesToCategories(place.types || []);

    const restaurant = await prisma.restaurant.upsert({
      where: { placeId: place.place_id },
      update: {
        name: place.name,
        address: address,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        rating: place.rating || null,
        priceLevel: place.price_level || null,
        phone: place.international_phone_number || null,
        website: place.website || null,
        photos: photoUrls,
      },
      create: {
        name: place.name,
        address: address,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        rating: place.rating || null,
        priceLevel: place.price_level || null,
        phone: place.international_phone_number || null,
        website: place.website || null,
        photos: photoUrls,
        placeId: place.place_id,
      },
    });

    // Link categories
    if (categoryNames.length > 0) {
      for (const categoryName of categoryNames) {
        let category = await prisma.category.findUnique({
          where: { name: categoryName },
        });

        if (!category) {
          try {
            category = await prisma.category.create({
              data: {
                name: categoryName,
                createdAt: new Date(),
              },
            });
          } catch (error: any) {
            if (error.code === "P2002") {
              // unique constraint ise tekrar çek
              category = await prisma.category.findUnique({
                where: { name: categoryName },
              });
            } else {
              throw error;
            }
          }
        }

        // Buradan sonra TS için garanti veriyoruz
        if (!category) {
          // Teorik olarak buraya düşmemeli, ama TS için guard
          continue;
          // istersen burada throw da atabilirsin:
          // throw new Error(`Category could not be created: ${categoryName}`);
        }

        await prisma.restaurantCategory.upsert({
          where: {
            restaurantId_categoryId: {
              restaurantId: restaurant.id,
              categoryId: category.id,
            },
          },
          update: {},
          create: {
            restaurantId: restaurant.id,
            categoryId: category.id,
          },
        });
      }
    }


    return restaurant;
  }

  /**
   * Map Google Places types to our category names
   */
  private mapGoogleTypesToCategories(types: string[]): string[] {
    const categoryMap: { [key: string]: string } = {
      'restaurant': 'Restoran',
      'cafe': 'Kafe',
      'bakery': 'Fırın',
      'meal_takeaway': 'Paket Servis',
      'meal_delivery': 'Sipariş',
      'bar': 'Bar',
      'pizza': 'Pizza',
      'italian_restaurant': 'İtalyan',
      'chinese_restaurant': 'Çin',
      'japanese_restaurant': 'Japon',
      'korean_restaurant': 'Kore',
      'mexican_restaurant': 'Meksika',
      'indian_restaurant': 'Hint',
      'thai_restaurant': 'Tayland',
      'turkish_restaurant': 'Türk',
      'fast_food_restaurant': 'Fast Food',
      'seafood_restaurant': 'Deniz Ürünleri',
      'steak_house': 'Et Restoranı',
      'vegetarian_restaurant': 'Vejetaryen',
      'vegan_restaurant': 'Vegan',
    };

    const categories: string[] = [];
    for (const type of types) {
      const categoryName = categoryMap[type];
      if (categoryName && !categories.includes(categoryName)) {
        categories.push(categoryName);
      }
    }

    // Default to 'Restoran' if no specific category found
    if (categories.length === 0) {
      categories.push('Restoran');
    }

    return categories;
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) *
      Math.cos(φ2) *
      Math.sin(Δλ / 2) *
      Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }
}

export default new PlacesService();

