import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App';
import { storageService, HistoryItem } from '../services/storage';
import { Restaurant } from '../services/api';
import { getCategoryIcon } from '../utils/categoryIcon';
import { formatDate } from '../utils/formatters';
import { styles, THEME } from './HistoryScreen.styles';

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


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.backgroundGradient}
      />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Geçmiş</Text>
          <Text style={styles.subtitle}>{history.length} kayıt</Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
            <MaterialCommunityIcons name="delete-outline" size={16} color="#fff" />
            <Text style={styles.clearButtonText}>Temizle</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <MaterialCommunityIcons name="history" size={50} color={THEME.textSec} />
            </View>
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
                style={styles.card}
                onPress={() => navigation.navigate('Map', { restaurant })}
                activeOpacity={0.7}
              >
                {/* Resim */}
                <View style={styles.imageContainer}>
                  {restaurant.photos && restaurant.photos.length > 0 ? (
                    <Image
                      source={{ uri: restaurant.photos[0] }}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text style={{ fontSize: 30 }}>
                        {getCategoryIcon(restaurant.name)}
                      </Text>
                    </View>
                  )}
                </View>

                {/* İçerik */}
                <View style={styles.cardContent}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.restaurantName} numberOfLines={1}>
                      {restaurant.name}
                    </Text>
                    {restaurant.rating && (
                      <View style={styles.ratingBadge}>
                        <MaterialCommunityIcons name="star" size={12} color={THEME.accent} />
                        <Text style={styles.ratingText}>
                          {restaurant.rating.toFixed(1)}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  {restaurant.address && (
                    <Text style={styles.addressText} numberOfLines={1}>
                      {restaurant.address}
                    </Text>
                  )}
                  
                  <View style={styles.cardFooterRow}>
                    <View style={styles.dateContainer}>
                      <MaterialCommunityIcons name="clock-outline" size={12} color={THEME.textSec} />
                      <Text style={styles.dateText}>
                        {formatDate(item.selectedAt)}
                      </Text>
                    </View>
                    {restaurant.distance && (
                      <View style={[styles.dateContainer, { marginLeft: 12 }]}>
                        <MaterialCommunityIcons name="map-marker-distance" size={12} color={THEME.textSec} />
                        <Text style={styles.dateText}>
                          {Math.round(restaurant.distance)}m
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Favori Butonu */}
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(restaurant);
                    }}
                  >
                    <MaterialCommunityIcons
                      name={isFavorite ? "heart" : "heart-outline"}
                      size={24}
                      color={isFavorite ? THEME.danger : THEME.textSec}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

