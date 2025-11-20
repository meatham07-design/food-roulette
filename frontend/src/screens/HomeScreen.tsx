import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { restaurantApi, Restaurant } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const RADIUS_OPTIONS = [
  { label: '500 m', value: 500 },
  { label: '1 km', value: 1000 },
  { label: '2 km', value: 2000 },
  { label: '5 km', value: 5000 },
];

export default function HomeScreen({ navigation }: Props) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRadius, setSelectedRadius] = useState(1000);
  const [customRadius, setCustomRadius] = useState(1000);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCategoryNames, setSelectedCategoryNames] = useState<string[]>([]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Konum İzni Gerekli',
          'Yakınındaki restoranları bulmak için konum iznine ihtiyacımız var.'
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Hata', 'Konum alınamadı. Lütfen tekrar deneyin.');
    }
  };

  const searchRestaurants = async () => {
    if (!location) {
      Alert.alert('Hata', 'Konum bilgisi alınamadı. Lütfen konum iznini kontrol edin.');
      return;
    }

    setLoading(true);
    try {
      console.log('🔍 Restoran aranıyor...', {
        lat: location.lat,
        lng: location.lng,
        radius: selectedRadius,
        categoryIds: selectedCategories,
      });

      const results = await restaurantApi.searchNearby(
        location.lat,
        location.lng,
        selectedRadius,
        selectedCategories
      );

      console.log('✅ Restoranlar bulundu:', results.length);

      setRestaurants(results);

      if (results.length === 0) {
        Alert.alert(
          'Sonuç Bulunamadı',
          'Seçtiğiniz alanda restoran bulunamadı. Mesafeyi artırmayı deneyin.'
        );
      } else {
        navigation.navigate('Roulette', { restaurants: results });
      }
    } catch (error: any) {
      console.error('❌ Search error:', error);
      
      let errorMessage = 'Restoranlar yüklenirken bir hata oluştu.';
      
      if (error.response) {
        // Backend'den gelen hata
        errorMessage = error.response.data?.error || `Backend hatası: ${error.response.status}`;
      } else if (error.request) {
        // Network hatası - backend'e ulaşılamıyor
        errorMessage = 'Backend\'e bağlanılamıyor. Backend çalışıyor mu? (http://localhost:3001)';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Hata', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRadiusChange = (value: number) => {
    setCustomRadius(value);
    setSelectedRadius(value);
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Ne Yesem?</Text>
          <Text style={styles.subtitle}>
            Yakınındaki restoranları bul ve ruleti çevir!
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hızlı Mesafe Seç</Text>
            <View style={styles.radiusContainer}>
              {RADIUS_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.radiusButton,
                    selectedRadius === option.value && styles.radiusButtonActive,
                  ]}
                  onPress={() => {
                    setSelectedRadius(option.value);
                    setCustomRadius(option.value);
                  }}
                >
                  <Text
                    style={[
                      styles.radiusButtonText,
                      selectedRadius === option.value && styles.radiusButtonTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Özel Mesafe</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={5000}
                step={50}
                value={customRadius}
                onValueChange={handleRadiusChange}
                minimumTrackTintColor="#ffd700"
                maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                thumbTintColor="#ffd700"
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>0 m</Text>
                <Text style={styles.sliderValue}>{formatDistance(customRadius)}</Text>
                <Text style={styles.sliderLabel}>5 km</Text>
              </View>
              <View style={styles.customInputContainer}>
                <Text style={styles.customInputLabel}>Manuel Giriş:</Text>
                <TextInput
                  style={styles.customInput}
                  value={customRadius.toString()}
                  onChangeText={(text) => {
                    const value = parseInt(text) || 0;
                    const clampedValue = Math.min(5000, Math.max(0, value));
                    setCustomRadius(clampedValue);
                    setSelectedRadius(clampedValue);
                  }}
                  keyboardType="numeric"
                  placeholder="0-5000"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                />
                <Text style={styles.customInputUnit}>m</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => {
                navigation.navigate('Filter', {
                  onApplyFilters: (filters: any) => {
                    setSelectedCategories(filters.categoryIds || []);
                    setSelectedCategoryNames(filters.categories || []);
                  },
                });
              }}
            >
              <Text style={styles.filterButtonText}>
                {selectedCategoryNames.length > 0
                  ? `${selectedCategoryNames.length} kategori seçildi: ${selectedCategoryNames.join(', ')}`
                  : 'Kategoriler'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.searchButton, loading && styles.searchButtonDisabled]}
            onPress={searchRestaurants}
            disabled={loading || !location}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.searchButtonText}>Restoranları Bul</Text>
            )}
          </TouchableOpacity>

          {restaurants.length > 0 && (
            <View style={styles.resultsInfo}>
              <Text style={styles.resultsText}>
                {restaurants.length} restoran bulundu
              </Text>
            </View>
          )}
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
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  radiusContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  radiusButton: {
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flex: 1,
    minWidth: 0,
  },
  radiusButtonActive: {
    backgroundColor: '#1a1a2e',
    borderColor: '#ffd700',
  },
  radiusButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  radiusButtonTextActive: {
    color: '#ffd700',
  },
  filterButton: {
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  sliderContainer: {
    marginTop: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  sliderLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  sliderValue: {
    color: '#ffd700',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  customInputLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 10,
  },
  customInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  customInputUnit: {
    color: '#ffd700',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  searchButton: {
    backgroundColor: '#1a1a2e',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: '#ffd700',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  resultsInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

