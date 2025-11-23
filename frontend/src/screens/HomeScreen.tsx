import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  FlatList,
} from 'react-native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { restaurantApi } from '../services/api';
import { showToast } from '../utils/toast';
import { styles, THEME } from './HomeScreen.styles';

// Hızlı kategoriler
const QUICK_CATEGORIES = [
  { id: 'burger', name: 'Burger', icon: 'hamburger' },
  { id: 'pizza', name: 'Pizza', icon: 'pizza' },
  { id: 'kebab', name: 'Kebap', icon: 'food-drumstick' },
  { id: 'sushi', name: 'Sushi', icon: 'fish' },
  { id: 'coffee', name: 'Kahve', icon: 'coffee' },
  { id: 'dessert', name: 'Tatlı', icon: 'cupcake' },
];

const MIN_RADIUS = 100;
const MAX_RADIUS = 5000;
const RADIUS_STEP = 100;
const DEFAULT_RADIUS = 1000;

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'waiting' | 'success' | 'error'>('waiting');

  const [selectedRadius, setSelectedRadius] = useState(DEFAULT_RADIUS);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCategoryNames, setSelectedCategoryNames] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      setLocationStatus('waiting');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationStatus('error');
        showToast.error('Konum izni olmadan mesafe hesaplayamayız.', 'İzin Gerekli');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      setLocationStatus('success');
    } catch (error) {
      setLocationStatus('error');
    }
  };

  const toggleQuickCategory = (id: string, name: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(prev => prev.filter(c => c !== id));
      setSelectedCategoryNames(prev => prev.filter(n => n !== name));
    } else {
      setSelectedCategories(prev => [...prev, id]);
      setSelectedCategoryNames(prev => [...prev, name]);
    }
  };

  const searchRestaurants = async () => {
    if (!location) {
      showToast.error('Konum alınamadı.', 'Hata');
      return;
    }
    setLoading(true);
    try {
      const response = await restaurantApi.searchNearby(
        location.lat,
        location.lng,
        selectedRadius,
        selectedCategories
      );

      let filteredResults = response.restaurants;
      if (minRating > 0) {
        filteredResults = response.restaurants.filter(r => r.rating !== null && r.rating >= minRating);
      }

      if (filteredResults.length === 0) {
        showToast.info('Kriterleri biraz esnetip tekrar dene! 🚀', 'Sonuç Yok');
      } else {
        navigation.navigate('Roulette', { 
          restaurants: filteredResults,
          location: { lat: location.lat, lng: location.lng },
          radius: selectedRadius,
        });
      }
    } catch (error: any) {
      showToast.error('Bağlantı sorunu.', 'Hata');
    } finally {
      setLoading(false);
    }
  };

  const formatDistance = (meters: number) => {
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
  };

  // Kategori öğesini render etme (FlatList için)
  const renderCategoryItem = ({ item }: { item: typeof QUICK_CATEGORIES[0] }) => {
    const isSelected = selectedCategories.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
        onPress={() => toggleQuickCategory(item.id, item.name)}
      >
        <MaterialCommunityIcons
          name={item.icon as any}
          size={20}
          color={isSelected ? '#000' : '#fff'}
        />
        <Text style={[styles.categoryPillText, isSelected && styles.categoryPillTextActive]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.backgroundGradient}
      />

      <View style={styles.content}>
        
        {/* --- 1. HEADER --- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Merhaba 👋</Text>
            <Text style={styles.title}>Ne Yiyoruz?</Text>
          </View>
          <View style={[styles.locationBadge, locationStatus === 'success' ? styles.locSuccess : styles.locWait]}>
            <MaterialCommunityIcons name="map-marker" size={18} color="#fff" />
          </View>
        </View>

        {/* --- 2. MESAFE SEÇİMİ --- */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mesafe</Text>
            <Text style={styles.valueText}>{formatDistance(selectedRadius)}</Text>
          </View>
          
          <Slider
            style={styles.slider}
            minimumValue={MIN_RADIUS}
            maximumValue={MAX_RADIUS}
            step={RADIUS_STEP}
            value={selectedRadius}
            onValueChange={setSelectedRadius}
            minimumTrackTintColor={THEME.accent}
            maximumTrackTintColor="rgba(255,255,255,0.1)"
            thumbTintColor={THEME.accent}
          />
          
          <View style={styles.presetRow}>
            {[500, 1000, 3000].map((val) => (
              <TouchableOpacity 
                key={val} 
                onPress={() => setSelectedRadius(val)}
                style={[styles.presetChip, selectedRadius === val && styles.presetChipActive]}
              >
                <Text style={[styles.presetChipText, selectedRadius === val && styles.presetChipTextActive]}>
                  {val >= 1000 ? `${val/1000}km` : `${val}m`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* --- 3. KATEGORİLER --- */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
             <Text style={styles.sectionTitle}>Kategori</Text>
             <TouchableOpacity onPress={() => navigation.navigate('Filter', {
                onApplyFilters: (f: any) => {
                  setSelectedCategories(f.categoryIds || []);
                  setSelectedCategoryNames(f.categories || []);
                }
             })}>
               <Text style={styles.linkText}>Tümü</Text>
             </TouchableOpacity>
          </View>
          
          <View style={{ height: 50 }}>
            <FlatList
              data={QUICK_CATEGORIES}
              renderItem={renderCategoryItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            />
          </View>
        </View>

        {/* --- 4. YILDIZ SEÇİMİ (YENİ TASARIM) --- */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Puan</Text>
            <Text style={styles.valueText}>
              {minRating === 0 ? 'Fark etmez' : `${minRating.toFixed(1)}+`}
            </Text>
          </View>
          
          {/* Yıldız Slider'ı */}
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={5}
            step={0.5}
            value={minRating}
            onValueChange={setMinRating}
            minimumTrackTintColor={THEME.accent}
            maximumTrackTintColor="rgba(255,255,255,0.1)"
            thumbTintColor={THEME.accent}
          />

          <View style={styles.ratingGrid}>
            <TouchableOpacity
              style={[styles.ratingOption, minRating === 0 && styles.ratingOptionActive]}
              onPress={() => setMinRating(0)}
            >
              <Text style={[styles.ratingText, minRating === 0 && styles.ratingTextActive]}>Tümü</Text>
            </TouchableOpacity>

            {[3.5, 4.0, 4.5].map((rate) => (
              <TouchableOpacity
                key={rate}
                style={[styles.ratingOption, minRating === rate && styles.ratingOptionActive]}
                onPress={() => setMinRating(rate)}
              >
                <MaterialCommunityIcons 
                  name="star" 
                  size={14} 
                  color={minRating === rate ? '#000' : THEME.accent} 
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.ratingText, minRating === rate && styles.ratingTextActive]}>
                  {rate}+
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* --- 5. BUTON (EN ALTTA SABİT) --- */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.mainButton, (!location || loading) && styles.disabledButton]}
            onPress={searchRestaurants}
            disabled={loading || !location}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[THEME.accent, '#FFA500']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              {loading ? (
                <ActivityIndicator color="#1a1a2e" />
              ) : (
                <>
                  <MaterialCommunityIcons name="dice-5" size={26} color="#1a1a2e" style={{marginRight:8}} />
                  <Text style={styles.btnText}>BANA YER BUL</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}