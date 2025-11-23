/**
 * Statik kategori listesi - Google Places API desteklenen type'lar ve keyword'ler
 * ID'ler backend'deki categoryMap ile eşleşmeli
 */
export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const STATIC_CATEGORIES: Category[] = [
  // Google Places API desteklenen type'lar
  { id: 'restaurant', name: 'Restoran', icon: '🍽️' },
  { id: 'cafe', name: 'Kafe', icon: '☕' },
  { id: 'bakery', name: 'Fırın', icon: '🥖' },
  { id: 'meal_takeaway', name: 'Paket Servis', icon: '🥡' },
  { id: 'meal_delivery', name: 'Sipariş', icon: '🚚' },
  { id: 'bar', name: 'Bar', icon: '🍺' },
  // Keyword ile arama yapılacak kategoriler (type: restaurant, keyword: spesifik)
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'italian', name: 'İtalyan', icon: '🍝' },
  { id: 'chinese', name: 'Çin', icon: '🥢' },
  { id: 'japanese', name: 'Japon', icon: '🍣' },
  { id: 'korean', name: 'Kore', icon: '🍜' },
  { id: 'mexican', name: 'Meksika', icon: '🌮' },
  { id: 'indian', name: 'Hint', icon: '🍛' },
  { id: 'thai', name: 'Tayland', icon: '🍲' },
  { id: 'turkish', name: 'Türk', icon: '🥘' },
  { id: 'fast_food', name: 'Fast Food', icon: '🍔' },
  { id: 'seafood', name: 'Deniz Ürünleri', icon: '🦞' },
  { id: 'steak_house', name: 'Et Restoranı', icon: '🥩' },
  { id: 'vegetarian', name: 'Vejetaryen', icon: '🥗' },
  { id: 'vegan', name: 'Vegan', icon: '🌱' },
];

