import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, ScrollView, Linking, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Restaurant } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

export default function MapScreen({ route, navigation }: Props) {
  const { restaurant } = route.params;

  useEffect(() => {
    // Automatically open map when screen loads
    handleOpenMap();
  }, []);

  const handleOpenMap = () => {
    const { latitude, longitude } = restaurant;
    
    // Try native maps first
    const nativeUrl = Platform.select({
      ios: `maps://app?daddr=${latitude},${longitude}`,
      android: `google.navigation:q=${latitude},${longitude}`,
    });

    if (nativeUrl) {
      Linking.canOpenURL(nativeUrl).then(supported => {
        if (supported) {
          Linking.openURL(nativeUrl);
        } else {
          // Fallback to web maps
          openWebMap();
        }
      }).catch(() => {
        openWebMap();
      });
    } else {
      openWebMap();
    }
  };

  const openWebMap = () => {
    const { latitude, longitude } = restaurant;
    const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(webUrl).catch(err => {
      Alert.alert('Hata', 'Harita uygulaması açılamadı');
    });
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Restaurant Photo */}
          {restaurant.photos && restaurant.photos.length > 0 ? (
            <Image
              source={{ uri: restaurant.photos[0] }}
              style={styles.restaurantImage}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderIcon}>
                {getCategoryIcon(restaurant.name)}
              </Text>
            </View>
          )}

          <View style={styles.infoCard}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            
            {restaurant.rating && (
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>
                  ⭐ {restaurant.rating.toFixed(1)}
                </Text>
              </View>
            )}

            {restaurant.address && (
              <View style={styles.addressContainer}>
                <Text style={styles.addressLabel}>📍 Adres</Text>
                <Text style={styles.address}>{restaurant.address}</Text>
              </View>
            )}

            {restaurant.distance && (
              <Text style={styles.distance}>
                {Math.round(restaurant.distance)}m uzaklıkta
              </Text>
            )}

            {restaurant.phone && (
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => Linking.openURL(`tel:${restaurant.phone}`)}
              >
                <Text style={styles.contactButtonText}>📞 Ara</Text>
              </TouchableOpacity>
            )}

            {restaurant.website && (
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => Linking.openURL(restaurant.website)}
              >
                <Text style={styles.contactButtonText}>🌐 Web Sitesi</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.mapButton}
              onPress={handleOpenMap}
            >
              <Text style={styles.mapButtonText}>🗺️ Haritada Aç</Text>
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
  },
  content: {
    flex: 1,
    padding: 20,
  },
  restaurantImage: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  placeholderIcon: {
    fontSize: 100,
  },
  infoCard: {
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  restaurantName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  rating: {
    fontSize: 24,
    color: '#ffd700',
    fontWeight: '600',
  },
  addressContainer: {
    marginBottom: 15,
  },
  addressLabel: {
    fontSize: 14,
    color: '#ffd700',
    fontWeight: '600',
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
  },
  distance: {
    fontSize: 16,
    color: '#ffd700',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  contactButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#ffd700',
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#ffd700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    padding: 18,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#ffd700',
    alignItems: 'center',
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  mapButtonText: {
    color: '#ffd700',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

