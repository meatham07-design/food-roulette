import axios from 'axios';
import { Platform } from 'react-native';

// API URL yapılandırması
// Environment variable'dan al, yoksa default değerleri kullan
const getApiBaseUrl = () => {
  // Docker veya environment variable'dan gelen URL
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Android emülatörü için özel IP
      // Fiziksel Android cihaz için: Bilgisayarınızın IP'sini kullanın
      // Örnek: 'http://192.168.1.100:3001/api'
      return 'http://10.0.2.2:3001/api'; // Android Studio emülatörü için
    }
    // iOS Simulator ve Web için localhost
    return 'http://localhost:3001/api';
  }
  return 'https://your-production-api.com/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 saniye (Google Places API yavaş olabilir)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - log requests
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    console.log('📋 Params:', config.params);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - log responses
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.message);
    if (error.response) {
      console.error('📊 Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('🌐 Network Error:', 'Backend\'e bağlanılamıyor. Backend çalışıyor mu?');
    }
    return Promise.reject(error);
  }
);

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number | null;
  rating: number | null;
  priceLevel: number | null;
  phone: string | null;
  website: string | null;
  photos: string[];
  categories?: Array<{ id: string; name: string }>;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string | null;
  icon: string | null;
}

export const restaurantApi = {
  /**
   * Search for nearby restaurants
   */
  searchNearby: async (
    latitude: number,
    longitude: number,
    radius: number = 1000,
    categoryIds?: string[]
  ): Promise<Restaurant[]> => {
    const params: any = {
      lat: latitude,
      lng: longitude,
      radius: radius,
    };
    
    if (categoryIds && categoryIds.length > 0) {
      params.categoryIds = categoryIds.join(',');
    }

    const response = await api.get('/restaurants/nearby', { params });
    return response.data.restaurants || [];
  },

  /**
   * Get restaurants with filters
   */
  getRestaurants: async (
    latitude?: number,
    longitude?: number,
    radius?: number,
    categoryId?: string
  ): Promise<Restaurant[]> => {
    const params: any = {};
    
    if (latitude) params.lat = latitude;
    if (longitude) params.lng = longitude;
    if (radius) params.radius = radius;
    if (categoryId) params.categoryId = categoryId;

    const response = await api.get('/restaurants', { params });
    return response.data.restaurants || [];
  },

  /**
   * Get a single restaurant
   */
  getRestaurant: async (id: string): Promise<Restaurant> => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data.restaurant;
  },
};

export const categoryApi = {
  /**
   * Get all categories
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data.categories || [];
  },

  /**
   * Get a single category with restaurants
   */
  getCategory: async (id: string) => {
    const response = await api.get(`/categories/${id}`);
    return response.data.category;
  },
};

export default api;

