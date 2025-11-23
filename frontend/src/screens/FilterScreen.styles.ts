import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;
const scale = (size: number) => {
  if (isSmallScreen) return size * 0.9;
  return size;
};
const CARD_WIDTH = (width - scale(60)) / 2; // İki kolonlu yapı için hesaplama

// Ortak Tema
export const THEME = {
  background: '#1a1a2e',
  textMain: '#FFFFFF',
  textSec: 'rgba(255, 255, 255, 0.6)',
  accent: '#FFD700', // Altın
  cardBg: 'rgba(255, 255, 255, 0.08)',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
  activeBg: 'rgba(255, 215, 0, 0.2)', // Seçili kart arka planı
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
    marginTop: scale(4),
  },
  closeButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    padding: scale(20),
    paddingTop: 0,
    paddingBottom: scale(100), // Footer için boşluk
  },

  // --- BİLGİ KARTI ---
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  infoText: {
    flex: 1,
    color: THEME.textMain,
    fontSize: 13,
    lineHeight: 18,
  },

  // --- KATEGORİLER GRİD ---
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: CARD_WIDTH,
    backgroundColor: THEME.cardBg,
    borderRadius: scale(16),
    padding: scale(15),
    marginBottom: scale(15),
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    // Gölge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryCardActive: {
    backgroundColor: THEME.activeBg,
    borderColor: THEME.accent,
    shadowColor: THEME.accent,
    shadowOpacity: 0.2,
  },
  
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainerActive: {
    backgroundColor: THEME.accent,
  },
  
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textMain,
    flex: 1,
  },
  categoryNameActive: {
    color: '#fff',
    fontWeight: '700',
  },
  
  checkBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: THEME.accent, // Altın rengi check
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1a1a2e',
  },

  // --- FOOTER ---
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 26, 46, 0.9)', // Hafif transparan arka plan
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    flexDirection: 'row',
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorder,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    backgroundColor: THEME.cardBg,
  },
  clearButtonText: {
    color: THEME.textSec,
    fontSize: 16,
    fontWeight: '600',
  },
  
  applyButton: {
    flex: 2,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: THEME.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  applyButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  applyButtonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: 'bold',
  },
});