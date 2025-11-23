import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App';
import { storageService } from '../services/storage';
import { Restaurant } from '../services/api';
import { getCategoryIcon } from '../utils/categoryIcon';
import { styles, THEME } from './FavoritesScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

export default function FavoritesScreen({ navigation }: Props) {
  const [favorites, setFavorites] = useState<Restaurant[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      const data = await storageService.getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const removeFavorite = async (restaurant: Restaurant) => {
    await storageService.removeFromFavorites(restaurant.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadFavorites();
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
        <Text style={styles.title}>Favorilerim</Text>
        <Text style={styles.subtitle}>
          {favorites.length > 0 
            ? `${favorites.length} favori mekanın var` 
            : 'Henüz favori eklemedin'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <MaterialCommunityIcons name="heart-broken" size={60} color={THEME.textSec} />
            </View>
            <Text style={styles.emptyText}>Listen Boş</Text>
            <Text style={styles.emptySubtext}>
              Beğendiğin restoranları kalp ikonuna basarak buraya ekleyebilirsin ❤️
            </Text>
          </View>
        ) : (
          favorites.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.card}
              onPress={() => navigation.navigate('Map', { restaurant })}
              activeOpacity={0.8}
            >
              {/* Resim Alanı */}
              <View style={styles.imageContainer}>
                {restaurant.photos && restaurant.photos.length > 0 ? (
                  <Image
                    source={{ uri: restaurant.photos[0] }}
                    style={styles.cardImage}
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={{fontSize: 24}}>
                      {getCategoryIcon(restaurant.name)}
                    </Text>
                  </View>
                )}
              </View>

              {/* Bilgi Alanı */}
              <View style={styles.cardContent}>
                <View style={styles.cardHeaderRow}>
                   <Text style={styles.restaurantName} numberOfLines={1}>{restaurant.name}</Text>
                   {restaurant.rating && (
                     <View style={styles.ratingBadge}>
                       <MaterialCommunityIcons name="star" size={14} color={THEME.accent} />
                       <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
                     </View>
                   )}
                </View>
                
                {/* Yıldız Gösterimi */}
                {restaurant.rating !== null && restaurant.rating !== undefined && (
                  <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <MaterialCommunityIcons
                        key={star}
                        name={star <= Math.round(restaurant.rating!) ? "star" : "star-outline"}
                        size={14}
                        color={THEME.accent}
                      />
                    ))}
                  </View>
                )}

                {restaurant.address && (
                  <Text style={styles.addressText} numberOfLines={1}>
                    {restaurant.address}
                  </Text>
                )}
                
                {restaurant.distance && (
                  <View style={styles.distanceRow}>
                     <MaterialCommunityIcons name="map-marker-distance" size={14} color={THEME.textSec} />
                     <Text style={styles.distanceText}>{Math.round(restaurant.distance)}m</Text>
                  </View>
                )}
              </View>

              {/* Silme Butonu (Kalp) */}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={(e) => {
                  e.stopPropagation();
                  removeFavorite(restaurant);
                }}
              >
                <MaterialCommunityIcons name="heart" size={24} color={THEME.danger} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}