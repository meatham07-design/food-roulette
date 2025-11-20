import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { RootStackParamList } from '../../App';
import { storageService } from '../services/storage';
import { Restaurant } from '../services/api';

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
      console.log('Loaded favorites:', data.length);
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

  const getCategoryIcon = (name: string): string => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('pizza')) return '🍕';
    if (nameLower.includes('kafe') || nameLower.includes('cafe')) return '☕';
    if (nameLower.includes('türk') || nameLower.includes('turkish')) return '🥘';
    if (nameLower.includes('italyan') || nameLower.includes('italian')) return '🍝';
    if (nameLower.includes('çin') || nameLower.includes('chinese')) return '🥢';
    if (nameLower.includes('japon') || nameLower.includes('japanese')) return '🍣';
    if (nameLower.includes('hint') || nameLower.includes('indian')) return '🍛';
    if (nameLower.includes('fast')) return '🍔';
    if (nameLower.includes('deniz') || nameLower.includes('seafood')) return '🦞';
    return '🍽️';
  };

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Favoriler</Text>
        <Text style={styles.subtitle}>{favorites.length} restoran</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>❤️</Text>
            <Text style={styles.emptyText}>Henüz favori yok</Text>
            <Text style={styles.emptySubtext}>
              Beğendiğiniz restoranları favorilere ekleyin
            </Text>
          </View>
        ) : (
          favorites.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.favoriteItem}
              onPress={() => navigation.navigate('Map', { restaurant })}
            >
              {restaurant.photos && restaurant.photos.length > 0 ? (
                <Image
                  source={{ uri: restaurant.photos[0] }}
                  style={styles.favoriteImage}
                />
              ) : (
                <View style={styles.favoriteImagePlaceholder}>
                  <Text style={styles.favoriteImagePlaceholderText}>
                    {getCategoryIcon(restaurant.name)}
                  </Text>
                </View>
              )}

              <View style={styles.favoriteInfo}>
                <Text style={styles.favoriteName}>{restaurant.name}</Text>
                {restaurant.address && (
                  <Text style={styles.favoriteAddress} numberOfLines={1}>
                    {restaurant.address}
                  </Text>
                )}
                <View style={styles.favoriteMeta}>
                  {restaurant.rating && (
                    <Text style={styles.favoriteRating}>
                      ⭐ {restaurant.rating.toFixed(1)}
                    </Text>
                  )}
                  {restaurant.distance && (
                    <Text style={styles.favoriteDistance}>
                      📍 {Math.round(restaurant.distance)}m
                    </Text>
                  )}
                </View>
              </View>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFavorite(restaurant)}
              >
                <Text style={styles.removeButtonText}>❤️</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  favoriteImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  favoriteImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  favoriteImagePlaceholderText: {
    fontSize: 40,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  favoriteAddress: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  favoriteMeta: {
    flexDirection: 'row',
    gap: 15,
  },
  favoriteRating: {
    fontSize: 14,
    color: '#ffd700',
    fontWeight: '600',
  },
  favoriteDistance: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  removeButtonText: {
    fontSize: 24,
  },
});

