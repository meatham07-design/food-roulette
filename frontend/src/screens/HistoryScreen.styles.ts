import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;
const scale = (size: number) => {
  if (isSmallScreen) return size * 0.9;
  return size;
};

// Ortak Tema (Home, Map ve Roulette ile uyumlu)
export const THEME = {
  background: '#1a1a2e',
  textMain: '#FFFFFF',
  textSec: 'rgba(255, 255, 255, 0.6)',
  accent: '#FFD700', // Altın
  cardBg: 'rgba(255, 255, 255, 0.08)',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
  danger: '#FF4B4B',
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
    padding: scale(20),
    paddingTop: scale(10),
  },

  // --- HEADER ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingTop: Platform.OS === 'ios' ? scale(60) : scale(40),
    paddingBottom: scale(20),
  },
  title: {
    fontSize: scale(32),
    fontWeight: '800',
    color: THEME.textMain,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: scale(14),
    color: THEME.textSec,
    marginTop: scale(2),
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 75, 75, 0.2)', // Hafif kırmızı
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderRadius: scale(20),
    borderWidth: 1,
    borderColor: 'rgba(255, 75, 75, 0.3)',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: scale(12),
    fontWeight: '600',
    marginLeft: scale(6),
  },

  // --- BOŞ DURUM ---
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: THEME.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: THEME.cardBorder,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: THEME.textMain,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: THEME.textSec,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },

  // --- GEÇMİŞ KARTI (Glassmorphism) ---
  card: {
    flexDirection: 'row',
    backgroundColor: THEME.cardBg,
    borderRadius: scale(16),
    padding: scale(14),
    marginBottom: scale(15),
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Sol: Resim
  imageContainer: {
    marginRight: scale(15),
  },
  cardImage: {
    width: scale(75),
    height: scale(75),
    borderRadius: scale(12),
    backgroundColor: '#333',
  },
  imagePlaceholder: {
    width: scale(75),
    height: scale(75),
    borderRadius: scale(12),
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  // Orta: İçerik
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  restaurantName: {
    fontSize: scale(16),
    fontWeight: '700',
    color: THEME.textMain,
    flex: 1,
    marginRight: scale(5),
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: scale(6),
    paddingVertical: scale(2),
    borderRadius: scale(6),
  },
  ratingText: {
    color: THEME.accent,
    fontSize: scale(11),
    fontWeight: 'bold',
    marginLeft: scale(2),
  },
  addressText: {
    fontSize: scale(13),
    color: THEME.textSec,
    marginBottom: scale(8),
  },
  
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: scale(11),
    color: THEME.textSec,
    marginLeft: scale(4),
  },

  // Sağ: Butonlar
  actionsContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingLeft: scale(10),
  },
  favoriteButton: {
    padding: scale(5),
  },
});