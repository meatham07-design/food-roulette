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
   * Returns up to 30 results using pagination if needed
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
      const allResults: GooglePlace[] = [];
      let nextPageToken: string | undefined = undefined;
      let pageCount = 0;
      const maxPages = 3; // Google Places API limit: max 3 pages per search = 60 results total (20 per page)

      // TÜM SAYFALARI AL - Google API limiti dahilinde maksimum sonuçları çek
      do {
        if (nextPageToken) {
          // Google API requirement: next_page_token kullanmadan önce 2 saniye bekle
          await new Promise(resolve => setTimeout(resolve, 2000));
          params.pagetoken = nextPageToken;
        }

        const response = await axios.get<PlacesSearchResponse>(url, { params });

        if (response.data.status === 'OK') {
          allResults.push(...(response.data.results || []));
          nextPageToken = (response.data as any).next_page_token;
          pageCount++;

          // Eğer next_page_token yoksa, daha fazla sayfa yok demektir
          if (!nextPageToken) {
            break;
          }
        } else if (response.data.status === 'ZERO_RESULTS') {
          break;
        } else {
          // Hata durumunda, eğer en az bir sayfa aldıysak mevcut sonuçları döndür
          if (pageCount > 0) {
            console.warn(`Google Places API warning: ${response.data.status}, returning ${allResults.length} results`);
            break;
          }
          throw new Error(`Google Places API error: ${response.data.status}`);
        }

        // Clear pagetoken from params for next iteration
        delete params.pagetoken;
      } while (nextPageToken && pageCount < maxPages);

      console.log(`✅ Fetched ${allResults.length} results from ${pageCount} page(s)`);

      // Sadece gerçek restoranları filtrele (kuyumcu, okul, market vb. hariç)
      const filteredResults = this.filterRestaurantsOnly(allResults);
      console.log(`🍽️ Filtered to ${filteredResults.length} restaurants (removed ${allResults.length - filteredResults.length} non-restaurant places)`);

      return filteredResults;
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
   * Filter results to only include actual restaurants/food places
   * Excludes: jewelry_store, school, store, bank, etc.
   */
  private filterRestaurantsOnly(places: GooglePlace[]): GooglePlace[] {
    // Sadece yemek/restoran ile ilgili type'ları kabul et
    const validRestaurantTypes = [
      'restaurant',
      'cafe',
      'bakery',
      'bar',
      'meal_takeaway',
      'meal_delivery',
      'food',
      'establishment', // Bazı restoranlar sadece 'establishment' olarak geliyor, ama name'de kontrol edeceğiz
    ];

    // Hariç tutulacak type'lar (restoran değil)
    const excludedTypes = [
      'jewelry_store', 'school', 'primary_school', 'secondary_school', 'university',
      'store', 'supermarket', 'convenience_store', 'clothing_store', 'electronics_store',
      'furniture_store', 'home_goods_store', 'shoe_store', 'department_store',
      'bank', 'atm', 'finance', 'accounting',
      'pharmacy', 'hospital', 'doctor', 'dentist', 'physiotherapist',
      'gas_station', 'car_repair', 'car_dealer', 'car_rental', 'car_wash', 'parking',
      'lodging', 'hotel',
      'real_estate_agency', 'lawyer', 'insurance_agency',
      'beauty_salon', 'hair_care', 'spa', 'gym',
      'church', 'mosque', 'synagogue', 'hindu_temple', 'place_of_worship',
      'cemetery', 'funeral_home',
      'post_office', 'police', 'fire_station', 'local_government_office',
      'city_hall', 'courthouse', 'library', 'school_district',
      'museum', 'art_gallery', 'zoo', 'amusement_park', 'park',
      'stadium', 'travel_agency', 'transit_station', 'airport',
      'general_contractor', 'electrician', 'plumber', 'roofing_contractor'
    ];

    const excludedNameKeywords = [
      'okul', 'lise', 'ilköğretim', 'kolej', 'college', 'school', 'dershane', 'kurs', 'eğitim',
      'kuyumcu', 'jewelry', 'gold', 'altın', 'gümüş',
      'eczane', 'pharmacy', 'medikal', 'optik', 'hastane', 'sağlık',
      'market', 'bakkal', 'süpermarket', 'tekel', 'büfe', 'kuruyemiş',
      'bank', 'banka', 'atm',
      'otel', 'hotel', 'pansiyon', 'konukevi', 'apart',
      'kırtasiye', 'iletişim', 'telekom', 'turkcell', 'vodafone', 'türk telekom',
      'kuaför', 'berber', 'güzellik', 'ofis', 'kırtasiye', 'sanayi',
      'derneği', 'vakfı', 'müdürlüğü', 'belediyesi'
    ];

    return places.filter(place => {
      // A. Business Status Kontrolü (API response içinde varsa)
      // Google Places API bazen 'business_status' döndürür.
      if ((place as any).business_status === 'CLOSED_TEMPORARILY' || (place as any).business_status === 'CLOSED_PERMANENTLY') {
        return false;
      }

      const types = place.types || [];
      const name = place.name?.toLowerCase() || '';

      // B. Tip Bazlı Eleme (Blacklist Check)
      const hasExcludedType = types.some(type => excludedTypes.includes(type));
      if (hasExcludedType) return false;

      // C. İsim Bazlı Eleme (Name Blacklist Check)
      // Kelimenin tam eşleşmesi veya içinde geçmesi durumunu kontrol et
      const hasExcludedName = excludedNameKeywords.some(keyword => name.includes(keyword));
      if (hasExcludedName) return false;

      // D. Geçerli Tip Kontrolü (Whitelist Check)
      // En az bir geçerli restoran tipi içermeli
      const hasValidType = types.some(type => validRestaurantTypes.includes(type));

      if (hasValidType) return true;

      // E. Eğer geçerli tip yoksa ama 'establishment' varsa ve ismi çok bariz restoransa (Fallback)
      if (types.includes('establishment')) {
        const restaurantKeywords = ['restoran', 'restaurant', 'cafe', 'kafe', 'lokanta', 'kebap', 'döner', 'pide', 'köfte', 'burger', 'pizza', 'meyhane', 'bistro', 'steak'];
        return restaurantKeywords.some(keyword => name.includes(keyword));
      }

      return false;
    });
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

