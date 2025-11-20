import AsyncStorage from '@react-native-async-storage/async-storage';
import { Restaurant } from './api';

const HISTORY_KEY = '@yemek_ruleti:history';
const FAVORITES_KEY = '@yemek_ruleti:favorites';

export interface HistoryItem {
  restaurant: Restaurant;
  selectedAt: string; // ISO date string
}

export const storageService = {
  // History operations
  async addToHistory(restaurant: Restaurant): Promise<void> {
    try {
      const history = await this.getHistory();
      const newItem: HistoryItem = {
        restaurant,
        selectedAt: new Date().toISOString(),
      };
      // Add to beginning, keep last 50 items
      const updatedHistory = [newItem, ...history].slice(0, 50);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  },

  async getHistory(): Promise<HistoryItem[]> {
    try {
      const data = await AsyncStorage.getItem(HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  },

  async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  },

  // Favorites operations
  async addToFavorites(restaurant: Restaurant): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const existingIndex = favorites.findIndex(f => f.id === restaurant.id);
      
      if (existingIndex === -1) {
        favorites.push(restaurant);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        console.log('Added to favorites:', restaurant.name, 'Total:', favorites.length);
      } else {
        console.log('Restaurant already in favorites:', restaurant.name);
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },

  async removeFromFavorites(restaurantId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const updated = favorites.filter(f => f.id !== restaurantId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  },

  async getFavorites(): Promise<Restaurant[]> {
    try {
      const data = await AsyncStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  async isFavorite(restaurantId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(f => f.id === restaurantId);
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },
};

