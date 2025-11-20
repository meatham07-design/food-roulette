import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  Modal,
  Share,
  Linking,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics';
import { RootStackParamList } from '../../App';
import { Restaurant } from '../services/api';
import { storageService } from '../services/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Roulette'>;

const { width } = Dimensions.get('window');
const WHEEL_SIZE = width * 0.85;

export default function RouletteScreen({ route, navigation }: Props) {
  const { restaurants } = route.params;
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const [wheelRotation, setWheelRotation] = useState(0);
  const confettiRef = useRef<any>(null);

  const segmentAngle = restaurants.length > 0 ? 360 / restaurants.length : 0;

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
    if (spinning || restaurants.length === 0) return;

    setSpinning(true);
    setSelectedRestaurant(null);
    setShowModal(false);
    setShowConfetti(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Random spin: 5-10 full rotations + random angle
    const randomRotations = 5 + Math.random() * 5;
    const randomSegmentIndex = Math.floor(Math.random() * restaurants.length);
    const randomOffsetInSegment = Math.random() * segmentAngle;
    const targetAngle = randomSegmentIndex * segmentAngle + randomOffsetInSegment;
    
    const totalRotation = wheelRotation + randomRotations * 360 + targetAngle;

    // Haptic feedback during spin (simplified - every 360 degrees)
    const hapticInterval = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 300); // Light haptic every 300ms during spin

    Animated.timing(spinValue, {
      toValue: totalRotation,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      clearInterval(hapticInterval);
      
      // Calculate which restaurant was selected
      const normalizedRotation = (totalRotation % 360 + 360) % 360;
      const adjustedAngle = (360 - normalizedRotation) % 360;
      const selectedIndex = Math.floor(adjustedAngle / segmentAngle);
      const selected = restaurants[selectedIndex % restaurants.length];
      
      setSelectedRestaurant(selected);
      setWheelRotation(normalizedRotation);
      setSpinning(false);
      
      // Strong haptic feedback on win
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Show confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      // Add to history
      storageService.addToHistory(selected);
      
      // Show modal
      setTimeout(() => {
        setShowModal(true);
      }, 500);
    });
  };

  const getRestaurantColor = (index: number) => {
    const colors = [
      '#1a1a2e', '#16213e', '#0f3460', '#533483',
      '#2d3561', '#3d5a80', '#4a4e69', '#5c4b99',
      '#6b5b95', '#7b68ee', '#8b7fa8', '#9b8fb8',
    ];
    return colors[index % colors.length];
  };

  const getRestaurantGradient = (index: number): [string, string] => {
    const gradients: [string, string][] = [
      ['#1a1a2e', '#16213e'],
      ['#16213e', '#0f3460'],
      ['#0f3460', '#533483'],
      ['#533483', '#2d3561'],
      ['#2d3561', '#3d5a80'],
      ['#3d5a80', '#4a4e69'],
      ['#4a4e69', '#5c4b99'],
      ['#5c4b99', '#6b5b95'],
      ['#6b5b95', '#7b68ee'],
      ['#7b68ee', '#8b7fa8'],
      ['#8b7fa8', '#9b8fb8'],
      ['#9b8fb8', '#1a1a2e'],
    ];
    return gradients[index % gradients.length];
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

  const handleShare = async () => {
    if (!selectedRestaurant) return;

    try {
      const message = `Yemek Ruleti benim için ${selectedRestaurant.name} mekanını seçti! Hadi gidelim! 🍕🎲`;
      await Share.share({
        message,
        title: 'Yemek Ruleti Sonucu',
      });
    } catch (error) {
      console.error('Error sharing:', error);
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
        // Fallback to web maps
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
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        await storageService.addToFavorites(selectedRestaurant);
        setIsFavorite(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      console.log('Favorite toggled:', !isFavorite, 'Restaurant:', selectedRestaurant.name);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const renderWheelSegments = () => {
    if (restaurants.length === 0) {
      return (
        <View style={styles.emptyWheel}>
          <Text style={styles.emptyText}>Restoran bulunamadı</Text>
          <Text style={styles.emptySubText}>Ana sayfadan filtreleri ayarlayın</Text>
        </View>
      );
    }

    const wheelRadius = WHEEL_SIZE / 2;
    const showNames = restaurants.length <= 12;
    
    return restaurants.map((restaurant, index) => {
      const rotation = index * segmentAngle;
      const textRotation = rotation + segmentAngle / 2;
      const isEven = index % 2 === 0;
      const gradient = getRestaurantGradient(index);
      
      // Segment metni için pozisyon hesaplamaları
      const textOffsetRadius = wheelRadius * (showNames ? 0.65 : 0.5);
      const textMidAngleRad = (textRotation - 90) * Math.PI / 180;
      
      const translateX = textOffsetRadius * Math.cos(textMidAngleRad);
      const translateY = textOffsetRadius * Math.sin(textMidAngleRad);
      
      return (
        <React.Fragment key={restaurant.id}>
          <View 
            style={styles.segmentOuterContainer}
          >
            <View 
              style={[
                styles.segmentShape,
                {
                  transform: [{ rotate: `${rotation - 90}deg` }],
                },
              ]}
            >
              <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.segmentGradient}
              />
            </View>
            
            <View
              style={[
                styles.segmentTextWrapper,
                {
                  transform: [
                    { translateX: translateX },
                    { translateY: translateY },
                    { rotate: `${textRotation}deg` },
                  ],
                },
              ]}
            >
              <View style={[styles.segmentNumber, isEven && styles.segmentNumberEven]}>
                <Text style={styles.segmentNumberText}>{index + 1}</Text>
              </View>
              {showNames && (
                <Text style={styles.segmentText} numberOfLines={1}>
                  {restaurant.name}
                </Text>
              )}
            </View>
          </View>

          {/* Segment ayırıcı çizgi */}
          {index > 0 && (
            <View
              key={`divider-${restaurant.id}`}
              style={[
                styles.segmentDividerLine,
                {
                  transform: [{ rotate: `${rotation}deg` }],
                },
              ]}
            />
          )}
        </React.Fragment>
      );
    });
  };

  const spinInterpolate = spinValue.interpolate({
    inputRange: [0, 360 * 10],
    outputRange: ['0deg', '3600deg'],
  });

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.container}
    >
      {showConfetti && (
        <ConfettiCannon
          count={200}
          origin={{ x: width / 2, y: 0 }}
          fadeOut
          autoStart
        />
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.wheelContainer}>
            <View style={styles.wheelWrapper}>
              <View style={styles.outerRing} />
              <View style={styles.outerRingInner} />
              
              <Animated.View
                style={[
                  styles.wheel,
                  {
                    transform: [{ rotate: spinInterpolate }],
                  },
                ]}
              >
                {renderWheelSegments()}
                <View style={styles.innerCircle} />
              </Animated.View>
              
              <TouchableOpacity
                style={styles.centerCircle}
                onPress={spinWheel}
                disabled={spinning || restaurants.length === 0}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#ffd700', '#ffed4e', '#ffd700']}
                  style={styles.centerGradient}
                >
                  <Text style={styles.centerText}>🎯</Text>
                  <Text style={styles.centerSubtext}>ÇEVİR</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <View style={styles.pointerContainer}>
                <View style={styles.pointer}>
                  <View style={styles.pointerInner} />
                </View>
                <View style={styles.pointerShadow} />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.spinButton, spinning && styles.spinButtonDisabled]}
            onPress={spinWheel}
            disabled={spinning || restaurants.length === 0}
          >
            <Text style={styles.spinButtonText}>
              {spinning ? 'Dönüyor...' : 'Ruleti Çevir!'}
            </Text>
          </TouchableOpacity>

          <View style={styles.restaurantList}>
            <Text style={styles.listTitle}>Restoranlar ({restaurants.length})</Text>
            {restaurants.map((restaurant, index) => (
              <View key={restaurant.id} style={styles.restaurantItem}>
                <View
                  style={[
                    styles.colorIndicator,
                    { backgroundColor: getRestaurantColor(index) },
                  ]}
                />
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  {restaurant.distance && (
                    <Text style={styles.restaurantDistance}>
                      {Math.round(restaurant.distance)}m
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Result Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <LinearGradient
              colors={['#0f0c29', '#302b63', '#24243e']}
              style={styles.modalGradient}
            >
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>

              {selectedRestaurant && (
                <>
                  {/* Restaurant Photo */}
                  {selectedRestaurant.photos && selectedRestaurant.photos.length > 0 ? (
                    <Image
                      source={{ uri: selectedRestaurant.photos[0] }}
                      style={styles.modalImage}
                    />
                  ) : (
                    <View style={styles.modalImagePlaceholder}>
                      <Text style={styles.modalImagePlaceholderText}>
                        {getCategoryIcon(selectedRestaurant.name)}
                      </Text>
                    </View>
                  )}

                  <Text style={styles.modalTitle}>🎉 Kazanan!</Text>
                  <Text style={styles.modalRestaurantName}>
                    {selectedRestaurant.name}
                  </Text>

                  {selectedRestaurant.rating && (
                    <View style={styles.modalRatingContainer}>
                      <Text style={styles.modalRating}>
                        ⭐ {selectedRestaurant.rating.toFixed(1)}
                      </Text>
                    </View>
                  )}

                  {selectedRestaurant.address && (
                    <Text style={styles.modalAddress}>
                      📍 {selectedRestaurant.address}
                    </Text>
                  )}

                  {selectedRestaurant.distance && (
                    <Text style={styles.modalDistance}>
                      {Math.round(selectedRestaurant.distance)}m uzaklıkta
                    </Text>
                  )}

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.favoriteButton]}
                      onPress={toggleFavorite}
                    >
                      <Text style={styles.modalButtonText}>
                        {isFavorite ? '❤️ Favorilerden Çıkar' : '🤍 Favorilere Ekle'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalButton, styles.mapButton]}
                      onPress={handleOpenMap}
                    >
                      <Text style={styles.modalButtonText}>🗺️ Haritada Göster</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalButton, styles.shareButton]}
                      onPress={handleShare}
                    >
                      <Text style={styles.modalButtonText}>📤 Paylaş</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  wheelContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  wheelWrapper: {
    width: WHEEL_SIZE + 20,
    height: WHEEL_SIZE + 20,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: WHEEL_SIZE + 20,
    height: WHEEL_SIZE + 20,
    borderRadius: (WHEEL_SIZE + 20) / 2,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderWidth: 3,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  outerRingInner: {
    position: 'absolute',
    width: WHEEL_SIZE + 10,
    height: WHEEL_SIZE + 10,
    borderRadius: (WHEEL_SIZE + 10) / 2,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    overflow: 'hidden',
    position: 'absolute',
    borderWidth: 6,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  innerCircle: {
    position: 'absolute',
    width: WHEEL_SIZE * 0.3,
    height: WHEEL_SIZE * 0.3,
    borderRadius: (WHEEL_SIZE * 0.3) / 2,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    top: '50%',
    left: '50%',
    marginTop: -(WHEEL_SIZE * 0.3) / 2,
    marginLeft: -(WHEEL_SIZE * 0.3) / 2,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  segmentOuterContainer: {
    position: 'absolute',
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    left: 0,
    top: 0,
  },
  segmentShape: {
    position: 'absolute',
    width: WHEEL_SIZE / 2,
    height: WHEEL_SIZE / 2,
    left: WHEEL_SIZE / 2,
    top: WHEEL_SIZE / 2,
    transformOrigin: '0 0',
    overflow: 'hidden',
  },
  segmentGradient: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
  },
  segmentDividerLine: {
    position: 'absolute',
    width: 2,
    height: WHEEL_SIZE / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    top: WHEEL_SIZE / 2,
    left: WHEEL_SIZE / 2 - 1,
    transformOrigin: 'top center',
    zIndex: 10,
  },
  segmentTextWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  segmentNumberEven: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    borderColor: 'rgba(255, 215, 0, 0.6)',
  },
  segmentNumberText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  segmentText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 0.2,
    lineHeight: 13,
  },
  centerCircle: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    top: (WHEEL_SIZE + 20) / 2 - 45,
    left: (WHEEL_SIZE + 20) / 2 - 45,
    zIndex: 15,
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 12,
    overflow: 'hidden',
  },
  centerGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },
  centerText: {
    fontSize: 36,
    marginBottom: -4,
  },
  centerSubtext: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1a1a2e',
    letterSpacing: 1,
  },
  pointerContainer: {
    position: 'absolute',
    top: -20,
    left: (WHEEL_SIZE + 20) / 2 - 25,
    width: 50,
    height: 50,
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderTopWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ffd700',
    position: 'relative',
  },
  pointerInner: {
    position: 'absolute',
    top: -38,
    left: -12,
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderTopWidth: 24,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ffed4e',
  },
  pointerShadow: {
    position: 'absolute',
    top: 2,
    left: -18,
    width: 0,
    height: 0,
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderTopWidth: 35,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: -1,
  },
  emptyWheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    backgroundColor: 'rgba(26, 26, 46, 0.4)',
    borderWidth: 6,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  spinButton: {
    backgroundColor: '#1a1a2e',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  spinButtonDisabled: {
    opacity: 0.6,
  },
  spinButtonText: {
    color: '#ffd700',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  restaurantList: {
    marginTop: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  restaurantItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 26, 46, 0.6)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 15,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  restaurantDistance: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalGradient: {
    borderRadius: 20,
    padding: 25,
    paddingBottom: 40,
    maxWidth: '100%',
    width: '100%',
    maxHeight: '90%',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalImagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  modalImagePlaceholderText: {
    fontSize: 80,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffd700',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalRestaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalRatingContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  modalRating: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffd700',
  },
  modalAddress: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalDistance: {
    fontSize: 14,
    color: '#ffd700',
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButtons: {
    gap: 12,
  },
  modalButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  favoriteButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#ffd700',
  },
  mapButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#ffd700',
  },
  shareButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#ffd700',
  },
  modalButtonText: {
    color: '#ffd700',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
