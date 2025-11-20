import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Filter'>;

// Statik kategori listesi - Google Places API desteklenen type'lar ve keyword'ler
// ID'ler backend'deki categoryMap ile eşleşmeli
const STATIC_CATEGORIES = [
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

export default function FilterScreen({ route, navigation }: Props) {
  const { onApplyFilters } = route.params;
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        // Remove if already selected
        return prev.filter(id => id !== categoryId);
      } else {
        // Add if not selected
        return [...prev, categoryId];
      }
    });
  };

  const handleApply = () => {
    const selected = STATIC_CATEGORIES.filter(c => selectedCategories.includes(c.id));
    onApplyFilters({
      categories: selected.map(c => c.name),
      categoryIds: selectedCategories,
    });
    navigation.goBack();
  };

  const handleClear = () => {
    setSelectedCategories([]);
    onApplyFilters({
      categories: [],
      categoryIds: [],
    });
    navigation.goBack();
  };

  return (
    <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Kategori Seç</Text>
          <Text style={styles.subtitle}>
            Hangi tür yemek istiyorsun?
          </Text>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {selectedCategories.length > 0 
                ? `${selectedCategories.length} kategori seçildi`
                : 'Birden fazla kategori seçebilirsiniz'}
            </Text>
          </View>

          {STATIC_CATEGORIES.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  isSelected && styles.categoryButtonActive,
                ]}
                onPress={() => handleCategoryToggle(category.id)}
              >
                <View style={styles.categoryButtonContent}>
                  <View style={styles.categoryButtonLeft}>
                    <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text
                      style={[
                        styles.categoryButtonText,
                        isSelected && styles.categoryButtonTextActive,
                      ]}
                    >
                      {category.icon} {category.name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
            >
              <Text style={styles.clearButtonText}>Temizle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Uygula</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 30,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  categoryButton: {
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    padding: 18,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#ffd700',
  },
  categoryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxActive: {
    backgroundColor: '#ffd700',
    borderColor: '#ffd700',
  },
  checkmark: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  categoryButtonTextActive: {
    color: '#ffd700',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 30,
  },
  clearButton: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffd700',
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  applyButtonText: {
    color: '#ffd700',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

