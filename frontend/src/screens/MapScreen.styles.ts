import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;
const scale = (size: number) => {
  if (isSmallScreen) return size * 0.9;
  return size;
};

// Home Screen ile aynı tema (Tutarlılık için)
export const THEME = {
  background: '#1a1a2e',
  textMain: '#FFFFFF',
  textSec: 'rgba(255, 255, 255, 0.7)',
  accent: '#FFD700', // Altın
  cardBg: 'rgba(255, 255, 255, 0.08)',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: scale(40),
  },

  // --- RESİM ALANI ---
  imageContainer: {
    width: '100%',
    height: height * 0.35, // Ekranın %35'i
    position: 'relative',
    borderBottomLeftRadius: scale(30),
    borderBottomRightRadius: scale(30),
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(10) },
    shadowOpacity: 0.5,
    shadowRadius: scale(20),
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a40',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: scale(60),
    marginTop: scale(10),
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%', // Resmin alt yarısını hafif karart
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? scale(50) : scale(30),
    left: scale(20),
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  // --- BİLGİ KARTI (Glassmorphism) ---
  infoCard: {
    marginTop: scale(-30), // Resmin üzerine hafif binsin
    marginHorizontal: scale(20),
    backgroundColor: THEME.cardBg,
    borderRadius: scale(24),
    padding: scale(24),
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(10),
    elevation: 5,
    // backdropFilter React Native'de desteklenmiyor, kaldırıldı
  },
  
  // Başlık Bölümü
  headerSection: {
    alignItems: 'center',
    marginBottom: scale(15),
  },
  restaurantName: {
    fontSize: scale(28),
    fontWeight: '800',
    color: THEME.textMain,
    textAlign: 'center',
    marginBottom: scale(8),
    letterSpacing: 0.5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(20),
  },
  ratingText: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: THEME.accent,
    marginRight: scale(5),
  },

  // Genel Satır Öğeleri
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(15),
  },
  distanceText: {
    fontSize: scale(14),
    color: THEME.textSec,
    marginLeft: scale(6),
  },
  
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: scale(15),
  },

  // Adres
  addressContainer: {
    flexDirection: 'row',
    marginBottom: scale(25),
  },
  addressText: {
    fontSize: scale(16),
    color: THEME.textSec,
    lineHeight: scale(22),
    marginLeft: scale(10),
    flex: 1,
  },

  // --- BUTONLAR ---
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(15),
    gap: scale(10),
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: scale(12),
    borderRadius: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flex: 1,
  },
  secondaryButtonText: {
    color: THEME.textMain,
    fontWeight: '600',
    marginLeft: scale(8),
    fontSize: scale(14),
  },

  // Harita Butonu
  mapButtonContainer: {
    borderRadius: scale(20),
    elevation: 8,
    shadowColor: THEME.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: scale(10),
    marginTop: scale(10),
  },
  mapButtonGradient: {
    flexDirection: 'row',
    paddingVertical: scale(18),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#1a1a2e',
    fontSize: scale(18),
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});