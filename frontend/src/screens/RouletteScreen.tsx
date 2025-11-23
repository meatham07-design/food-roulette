import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
  ScrollView,
  Modal,
  Share,
  Linking,
  Platform,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App';
import { Restaurant } from '../services/api';
import { storageService } from '../services/storage';
import { getCategoryIcon } from '../utils/categoryIcon';
import { getRestaurantColor } from '../utils/wheelUtils';
import { showToast } from '../utils/toast';
import { restaurantApi } from '../services/api';
import { styles, THEME, WHEEL_SIZE } from './RouletteScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Roulette'>;

// EKSİK OLAN WIDTH TANIMI EKLENDİ
const { width } = Dimensions.get('window');

const MAX_WHEEL_SEGMENTS = 30;

// Fallback fonksiyonu
const selectRandomRestaurants = (allRestaurants: Restaurant[]): Restaurant[] => {
  if (allRestaurants.length <= MAX_WHEEL_SEGMENTS) {
    return allRestaurants;
  }
  const shuffled = [...allRestaurants].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, MAX_WHEEL_SEGMENTS);
};

export default function RouletteScreen({ route, navigation }: Props) {
  const initialRestaurants = route.params.restaurants;
  const location = route.params.location;
  const radius = route.params.radius || 5000;

  const [wheelRestaurants, setWheelRestaurants] = useState<Restaurant[]>(() => 
    selectRandomRestaurants(initialRestaurants)
  );
  const [remainingCount, setRemainingCount] = useState<number>(initialRestaurants.length);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const spinValue = useRef(new Animated.Value(0)).current;
  const [wheelRotation, setWheelRotation] = useState(0);

  const segmentAngle = wheelRestaurants.length > 0 ? 360 / wheelRestaurants.length : 0;

  // İlk yükleme (Backend Sync)
  useEffect(() => {
    if (location && initializing) {
      fetchTotalCount();
    }
  }, [location]);

  const fetchTotalCount = async () => {
    if (!location) return;
    try {
      const response = await restaurantApi.getRouletteRestaurants(
        location.lat,
        location.lng,
        radius,
        MAX_WHEEL_SEGMENTS
      );
      setRemainingCount(response.remainingCount);
      if (response.restaurants && response.restaurants.length > 0) {
        setWheelRestaurants(response.restaurants);
      }
      setInitializing(false);
    } catch (error: any) {
      setRemainingCount(initialRestaurants.length);
      setInitializing(false);
    }
  };

  const handleMix = async () => {
    if (!location) {
      showToast.error('Konum bilgisi bulunamadı.', 'Hata');
      return;
    }
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const response = await restaurantApi.shuffleRoulette(
        location.lat,
        location.lng,
        radius,
        MAX_WHEEL_SEGMENTS
      );

      if (response.message) showToast.info(response.message, 'Bilgi');

      setRemainingCount(response.remainingCount);
      setWheelRestaurants(response.restaurants);
      setSelectedRestaurant(null);
      setShowModal(false);
      setWheelRotation(0);
      spinValue.setValue(0);

      showToast.success('Liste yenilendi! 🎲', 'Başarılı');
    } catch (error: any) {
      showToast.error('Yeni restoranlar alınamadı.', 'Hata');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRestaurant) {
      checkFavoriteStatus();
    }
  }, [selectedRestaurant]);

  const checkFavoriteStatus = async () => {
    if (selectedRestaurant) {
      const favorite = await storageService.isFavorite(selectedRestaurant.id);
      setIsFavorite(favorite);
    }
  };

  const spinWheel = () => {
    if (spinning || wheelRestaurants.length === 0) return;

    setSpinning(true);
    setSelectedRestaurant(null);
    setShowModal(false);
    setShowConfetti(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const randomRotations = 5 + Math.random() * 5;
    const randomOffset = Math.random() * 360; 
    const totalRotation = wheelRotation + (360 * 5) + randomOffset;
    
    const hapticInterval = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 200);

    Animated.timing(spinValue, {
      toValue: totalRotation,
      duration: 4000,
      useNativeDriver: true,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    }).start(() => {
      clearInterval(hapticInterval);
      
      const normalizedAngle = ((totalRotation % 360) + 360) % 360;
      const adjustedAngle = (360 - normalizedAngle) % 360;
      const selectedIndex = Math.floor(adjustedAngle / segmentAngle);
      const index = Math.min(Math.max(selectedIndex, 0), wheelRestaurants.length - 1);
      
      const selected = wheelRestaurants[index];
      
      setSelectedRestaurant(selected);
      setWheelRotation(totalRotation);
      setSpinning(false);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      storageService.addToHistory(selected);
      setTimeout(() => {
        setShowModal(true);
      }, 500);
    });
  };

  const handleShare = async () => {
    if (!selectedRestaurant) return;
    try {
      const message = `Yemek Ruleti benim için ${selectedRestaurant.name} mekanını seçti! Hadi gidelim! 🍕🎲`;
      await Share.share({ message, title: 'Yemek Ruleti Sonucu' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenMap = () => {
    if (!selectedRestaurant) return;
    const { latitude, longitude } = selectedRestaurant;
    const url = Platform.select({
      ios: `maps://app?daddr=${latitude},${longitude}`,
      android: `google.navigation:q=${latitude},${longitude}`,
    });

    if (url) {
      Linking.openURL(url).catch(() => {
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(webUrl);
      });
    }
  };

  const toggleFavorite = async () => {
    if (!selectedRestaurant) return;
    try {
      if (isFavorite) {
        await storageService.removeFromFavorites(selectedRestaurant.id);
        setIsFavorite(false);
      } else {
        await storageService.addToFavorites(selectedRestaurant);
        setIsFavorite(true);
      }
      Haptics.selectionAsync();
    } catch (error) {
      console.error(error);
    }
  };

  const spinInterpolate = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const renderWheelSegments = () => {
    if (wheelRestaurants.length === 0) return null;

    return wheelRestaurants.map((restaurant, index) => {
      const rotate = index * segmentAngle;
      const displayName = restaurant.name.length > 14 
        ? restaurant.name.substring(0, 12) + '..' 
        : restaurant.name;
      
      return (
          <View 
          key={restaurant.id}
              style={[
            styles.segmentContainer,
                {
              transform: [
                { rotate: `${rotate}deg` },
              ],
                },
              ]}
            >
          <View style={[styles.segmentLine, { height: WHEEL_SIZE / 2 }]} />
            <View
              style={[
              styles.segmentContent,
                {
                  transform: [
                  { rotate: `${segmentAngle / 2}deg` },
                  { translateY: -WHEEL_SIZE / 4 }, 
                  ],
                },
              ]}
            >
            <View style={styles.segmentInnerWrapper}>
               <Text style={styles.segmentText} numberOfLines={1}>
                 {displayName}
               </Text>
               <View style={[styles.segmentNumber, { backgroundColor: getRestaurantColor(index) }]}>
                <Text style={styles.segmentNumberText}>{index + 1}</Text>
              </View>
            </View>
          </View>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.backgroundGradient}
      />

      {showConfetti && (
        <ConfettiCannon
          count={200}
          origin={{ x: width / 2, y: -10 }}
          fadeOut={true}
          autoStart={true}
          fallSpeed={3000}
        />
      )}

      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
           <Text style={styles.headerTitle}>Lezzet Ruleti</Text>
           <Text style={styles.headerSubtitle}>Döndür Gelsin 🎲</Text>
        </View>

        <View style={styles.wheelContainer}>
          <View style={styles.pointerContainer}>
            <MaterialCommunityIcons name="map-marker-down" size={40} color={THEME.danger} />
          </View>

          <View style={styles.wheelWrapper}>
            <Animated.View
              style={[
                styles.wheel,
                { transform: [{ rotate: spinInterpolate }] },
              ]}
            >
              <View style={styles.wheelBackground} />
              {renderWheelSegments()}
              <View style={styles.centerHub} />
            </Animated.View>
          </View>
        </View>

        {/* ANA ÇEVİR BUTONU */}
        <TouchableOpacity
          style={[styles.spinButton, spinning && styles.spinButtonDisabled]}
          onPress={spinWheel}
          disabled={spinning || wheelRestaurants.length === 0}
          activeOpacity={0.8}
        >
           <LinearGradient
              colors={spinning ? ['#555', '#777'] : [THEME.accent, '#ff6b6b']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.spinButtonGradient}
          >
            <Text style={styles.spinButtonText}>
              {spinning ? 'DÖNÜYOR...' : 'ÇEVİR'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* --- KONTROL ÇUBUĞU (YENİ COMPACT TASARIM) --- */}
        {location && !initializing && (
          <View style={styles.controlBar}>
            {/* Sol Taraf: Bilgi */}
            <View style={styles.infoBadge}>
              <MaterialCommunityIcons name="database-outline" size={14} color={THEME.textSec} />
              <Text style={styles.infoText}>
                Havuz: {remainingCount} Mekan
              </Text>
            </View>

            {/* Sağ Taraf: Karıştır Butonu */}
            <TouchableOpacity
              style={[styles.miniShuffleButton, loading && { opacity: 0.6 }]}
              onPress={handleMix}
              disabled={loading || spinning}
            >
              <LinearGradient
                colors={[THEME.cardBg, 'rgba(255,255,255,0.1)']}
                style={styles.miniShuffleGradient}
              >
                {loading ? (
                  <MaterialCommunityIcons name="loading" size={16} color={THEME.accent} />
                ) : (
                  <>
                    <MaterialCommunityIcons name="shuffle-variant" size={16} color={THEME.accent} />
                    <Text style={styles.miniShuffleText}>Yenile</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Liste (Legend) */}
        <View style={styles.legendContainer}>
          <View style={styles.legendHeader}>
            <Text style={styles.legendTitle}>ÇARKTADAKİ ADAYLAR ({wheelRestaurants.length})</Text>
          </View>
          {wheelRestaurants.map((restaurant, index) => (
            <View key={restaurant.id} style={styles.legendItem}>
                <View
                  style={[
                  styles.legendColorBox,
                    { backgroundColor: getRestaurantColor(index) },
                  ]}
              >
                <Text style={styles.legendNumber}>{index + 1}</Text>
                </View>
              <Text style={styles.legendName} numberOfLines={1}>{restaurant.name}</Text>
              </View>
            ))}
        </View>
      </ScrollView>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={[THEME.cardBg, '#2a2a40']}
              style={styles.modalContent}
            >
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowModal(false)}
              >
                <MaterialCommunityIcons name="close" size={24} color={THEME.textMain} />
              </TouchableOpacity>

              {selectedRestaurant && (
                <>
                  <Text style={styles.winnerLabel}>🎉 KAZANAN 🎉</Text>
                  
                  <View style={styles.modalImageContainer}>
                  {selectedRestaurant.photos && selectedRestaurant.photos.length > 0 ? (
                    <Image
                      source={{ uri: selectedRestaurant.photos[0] }}
                      style={styles.modalImage}
                    />
                  ) : (
                    <View style={styles.modalImagePlaceholder}>
                        <Text style={{fontSize: 50}}>{getCategoryIcon(selectedRestaurant.name)}</Text>
                    </View>
                  )}
                    </View>

                  <Text style={styles.modalTitle}>{selectedRestaurant.name}</Text>
                  <Text style={styles.modalAddress}>{selectedRestaurant.address}</Text>

                  <View style={styles.modalActions}>
                    <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
                      <MaterialCommunityIcons 
                        name={isFavorite ? "heart" : "heart-outline"} 
                        size={28} 
                        color={isFavorite ? THEME.danger : THEME.textMain} 
                      />
                      <Text style={styles.actionText}>Favori</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, styles.actionButtonPrimary]} onPress={handleOpenMap}>
                      <MaterialCommunityIcons name="navigation" size={28} color="#1a1a2e" />
                      <Text style={[styles.actionText, {color: '#1a1a2e', fontWeight: 'bold'}]}>Git</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                      <MaterialCommunityIcons name="share-variant" size={28} color={THEME.textMain} />
                      <Text style={styles.actionText}>Paylaş</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </View>
  );
}