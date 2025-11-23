import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App';
import { styles, THEME } from './FilterScreen.styles';

// Kategori Listesi ve İkonları
const CATEGORIES = [
  { id: 'burger', name: 'Burger', icon: 'hamburger' },
  { id: 'pizza', name: 'Pizza', icon: 'pizza' },
  { id: 'kebab', name: 'Kebap', icon: 'food-drumstick' },
  { id: 'sushi', name: 'Sushi', icon: 'fish' },
  { id: 'dessert', name: 'Tatlı', icon: 'cupcake' },
  { id: 'coffee', name: 'Kahve', icon: 'coffee' },
  { id: 'seafood', name: 'Deniz Ürünleri', icon: 'fish' },
  { id: 'pasta', name: 'Makarna', icon: 'noodles' },
  { id: 'steak', name: 'Et / Steak', icon: 'food-steak' },
  { id: 'vegan', name: 'Vegan', icon: 'leaf' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Filter'>;

export default function FilterScreen({ navigation, route }: Props) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const applyFilters = () => {
    // Seçili kategorilerin isimlerini bul
    const selectedNames = CATEGORIES
      .filter(c => selectedCategories.includes(c.id))
      .map(c => c.name);

    // Home ekranına parametreleri geri gönder
    if (route.params?.onApplyFilters) {
      route.params.onApplyFilters({
        categoryIds: selectedCategories,
        categories: selectedNames
      });
    }
    navigation.goBack();
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Arkaplan Gradyanı */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.backgroundGradient}
      />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Filtreler</Text>
          <Text style={styles.subtitle}>Canın tam olarak ne çekiyor?</Text>
        </View>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.closeButton}
        >
          <MaterialCommunityIcons name="close" size={24} color={THEME.textMain} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Bilgi Kartı */}
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="information-outline" size={20} color={THEME.accent} style={{marginRight: 10}} />
          <Text style={styles.infoText}>
            Birden fazla kategori seçebilirsin. Hiçbir şey seçmezsen "Tümü" aranır.
          </Text>
        </View>

        {/* Kategoriler Grid */}
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((item) => {
            const isSelected = selectedCategories.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.categoryCard, isSelected && styles.categoryCardActive]}
                onPress={() => toggleCategory(item.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, isSelected && styles.iconContainerActive]}>
                  <MaterialCommunityIcons 
                    name={item.icon as any} 
                    size={24} 
                    color={isSelected ? '#1a1a2e' : THEME.textMain} 
                  />
                </View>
                <Text style={[styles.categoryName, isSelected && styles.categoryNameActive]}>
                  {item.name}
                </Text>
                
                {/* Seçim İkonu (Check) */}
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <MaterialCommunityIcons name="check" size={12} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* --- FOOTER BUTONLARI --- */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={clearFilters}
        >
          <Text style={styles.clearButtonText}>Temizle</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.applyButton} 
          onPress={applyFilters}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[THEME.accent, '#FFA500']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.applyButtonGradient}
          >
            <Text style={styles.applyButtonText}>Uygula ({selectedCategories.length})</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#1a1a2e" style={{marginLeft: 5}} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}