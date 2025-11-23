import React from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  Image, 
  ScrollView, 
  Linking, 
  Platform, 
  StatusBar 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App';
import { getCategoryIcon } from '../utils/categoryIcon';
import { showToast } from '../utils/toast';
import { styles, THEME } from './MapScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

export default function MapScreen({ route, navigation }: Props) {
  const { restaurant } = route.params;

  const handleOpenMap = () => {
    const { latitude, longitude } = restaurant;
    
    const nativeUrl = Platform.select({
      ios: `maps://app?daddr=${latitude},${longitude}`,
      android: `google.navigation:q=${latitude},${longitude}`,
    });

    if (nativeUrl) {
      Linking.canOpenURL(nativeUrl).then(supported => {
        if (supported) {
          Linking.openURL(nativeUrl);
        } else {
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
      showToast.error('Harita uygulaması açılamadı', 'Hata');
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialCommunityIcons 
          key={i} 
          name={i <= rating ? "star" : "star-outline"} 
          size={20} 
          color={THEME.accent} 
        />
      );
    }
    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.backgroundGradient}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- RESTORAN GÖRSELİ --- */}
        <View style={styles.imageContainer}>
          {restaurant.photos && restaurant.photos.length > 0 ? (
            <Image
              source={{ uri: restaurant.photos[0] }}
              style={styles.restaurantImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialCommunityIcons name="silverware-variant" size={60} color="rgba(255,255,255,0.3)" />
              <Text style={styles.placeholderIcon}>
                {getCategoryIcon(restaurant.name)}
              </Text>
            </View>
          )}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.imageOverlay}
          />
          
           <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* --- BİLGİ KARTI --- */}
        <View style={styles.infoCard}>
          
          <View style={styles.headerSection}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            {restaurant.rating && (
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
                {renderStars(Math.round(restaurant.rating))}
              </View>
            )}
          </View>

          {restaurant.distance && (
            <View style={styles.rowItem}>
               <MaterialCommunityIcons name="map-marker-distance" size={20} color={THEME.textSec} />
               <Text style={styles.distanceText}>
                {Math.round(restaurant.distance)}m uzaklıkta
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          {restaurant.address && (
            <View style={styles.addressContainer}>
              <MaterialCommunityIcons name="map-marker" size={22} color={THEME.accent} style={{marginTop: 2}} />
              <Text style={styles.addressText}>{restaurant.address}</Text>
            </View>
          )}

          {/* --- İLETİŞİM BUTONLARI --- */}
          <View style={styles.actionButtonsRow}>
            {restaurant.phone && (
              <TouchableOpacity
                style={[styles.secondaryButton, { flex: 1, marginRight: 10 }]}
                onPress={() => Linking.openURL(`tel:${restaurant.phone}`)}
              >
                <MaterialCommunityIcons name="phone" size={20} color={THEME.textMain} />
                <Text style={styles.secondaryButtonText}>Ara</Text>
              </TouchableOpacity>
            )}

            {restaurant.website && (
              <TouchableOpacity
                style={[styles.secondaryButton, { flex: 1 }]}
                // DÜZELTME BURADA YAPILDI: restaurant.website! eklendi
                onPress={() => Linking.openURL(restaurant.website!)}
              >
                <MaterialCommunityIcons name="web" size={20} color={THEME.textMain} />
                <Text style={styles.secondaryButtonText}>Web</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* --- ANA HARİTA BUTONU --- */}
          <TouchableOpacity
            style={styles.mapButtonContainer}
            onPress={handleOpenMap}
            activeOpacity={0.8}
          >
             <LinearGradient
                colors={[THEME.accent, '#e94560']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.mapButtonGradient}
              >
              <MaterialCommunityIcons name="navigation" size={26} color="#1a1a2e" style={{marginRight: 8}} />
              <Text style={styles.mapButtonText}>YOL TARİFİ AL</Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}