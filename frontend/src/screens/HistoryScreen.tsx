import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { RootStackParamList } from '../../App';
import { storageService, HistoryItem } from '../services/storage';
import { Restaurant } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

export default function HistoryScreen({ navigation }: Props) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
      loadFavorites();
    }, [])
  );

  const loadHistory = async () => {
    const data = await storageService.getHistory();
    setHistory(data);
  };

  const loadFavorites = async () => {
    const favs = await storageService.getFavorites();
    setFavorites(favs.map(f => f.id));
  };

  const toggleFavorite = async (restaurant: Restaurant) => {
    const isFavorite = favorites.includes(restaurant.id);
    
    if (isFavorite) {
      await storageService.removeFromFavorites(restaurant.id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      await storageService.addToFavorites(restaurant);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    await loadFavorites();
  };

  const clearHistory = () => {
    Alert.alert(
      'Geçmişi Temizle',
      'Tüm geçmişi silmek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            await storageService.clearHistory();
            await loadHistory();
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Az önce';
    if (minutes < 60) return `${minutes} dakika önce`;
    if (hours < 24) return `${hours} saat önce`;
    if (days < 7) return `${days} gün önce`;
    return date.toLocaleDateString('tr-TR');
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
        <Text style={styles.title}>Geçmiş</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Temizle</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz geçmiş yok</Text>
            <Text style={styles.emptySubtext}>
              Rulet çevirdiğinizde seçilen restoranlar burada görünecek
            </Text>
          </View>
        ) : (
          history.map((item, index) => {
            const restaurant = item.restaurant;
            const isFavorite = favorites.includes(restaurant.id);

            return (
              <TouchableOpacity
                key={`${restaurant.id}-${index}`}
                style={styles.historyItem}
                onPress={() => navigation.navigate('Map', { restaurant })}
              >
                {restaurant.photos && restaurant.photos.length > 0 ? (
                  <Image
                    source={{ uri: restaurant.photos[0] }}
                    style={styles.historyImage}
                  />
                ) : (
                  <View style={styles.historyImagePlaceholder}>
                    <Text style={styles.historyImagePlaceholderText}>
                      {getCategoryIcon(restaurant.name)}
                    </Text>
                  </View>
                )}

                <View style={styles.historyInfo}>
                  <Text style={styles.historyName}>{restaurant.name}</Text>
                  {restaurant.address && (
                    <Text style={styles.historyAddress} numberOfLines={1}>
                      {restaurant.address}
                    </Text>
                  )}
                  <View style={styles.historyMeta}>
                    {restaurant.rating && (
                      <Text style={styles.historyRating}>
                        ⭐ {restaurant.rating.toFixed(1)}
                      </Text>
                    )}
                    {restaurant.distance && (
                      <Text style={styles.historyDistance}>
                        📍 {Math.round(restaurant.distance)}m
                      </Text>
                    )}
                  </View>
                  <Text style={styles.historyDate}>
                    {formatDate(item.selectedAt)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(restaurant)}
                >
                  <Text style={styles.favoriteIcon}>
                    {isFavorite ? '❤️' : '🤍'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  clearButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffd700',
  },
  clearButtonText: {
    color: '#ffd700',
    fontSize: 14,
    fontWeight: '600',
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
  historyItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  historyImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  historyImagePlaceholder: {
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
  historyImagePlaceholderText: {
    fontSize: 40,
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  historyAddress: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  historyMeta: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 5,
  },
  historyRating: {
    fontSize: 14,
    color: '#ffd700',
    fontWeight: '600',
  },
  historyDistance: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  historyDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  favoriteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  favoriteIcon: {
    fontSize: 24,
  },
});

