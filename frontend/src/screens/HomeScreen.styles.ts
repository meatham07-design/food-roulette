import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Ekran boyutuna göre dinamik padding (Küçük ekranlarda sıkışmaması için)
const SPACING = height < 700 ? 12 : 20; 

export const THEME = {
  background: '#1a1a2e',
  textMain: '#FFFFFF',
  textSec: 'rgba(255, 255, 255, 0.6)',
  accent: '#FFD700', 
  cardBg: 'rgba(255, 255, 255, 0.05)',
  cardBorder: 'rgba(255, 255, 255, 0.1)',
  success: '#00E676',
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    justifyContent: 'space-between', // Elemanları dikeyde yay
  },

  // --- HEADER ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING,
  },
  greeting: {
    color: THEME.textSec,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: THEME.textMain,
    letterSpacing: 0.5,
  },
  locationBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  locSuccess: { backgroundColor: 'rgba(0, 230, 118, 0.2)' },
  locWait: { opacity: 0.5 },

  // --- SECTION ORTAK STİLİ (KART YERİNE DAHA HAFİF PANEL) ---
  sectionContainer: {
    backgroundColor: THEME.cardBg,
    borderRadius: 20,
    padding: SPACING, // 15-20px
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    // Dikeyde esnek ama çok büyümesin
    flexGrow: 0,
    marginBottom: SPACING,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.textMain,
  },
  valueText: {
    color: THEME.accent,
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkText: {
    color: THEME.textSec,
    fontSize: 13,
    textDecorationLine: 'underline',
  },

  // --- MESAFE KONTROLLERİ ---
  slider: {
    width: '100%',
    height: 40,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  presetChip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    minWidth: 60,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  presetChipActive: {
    borderColor: THEME.accent,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  presetChipText: {
    color: THEME.textSec,
    fontSize: 12,
    fontWeight: '600',
  },
  presetChipTextActive: {
    color: THEME.accent,
  },

  // --- KATEGORİ HAPLARI ---
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryPillActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  categoryPillText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 13,
  },
  categoryPillTextActive: {
    color: '#000',
  },

  // --- PUAN (RATING) GRİD ---
  ratingGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  ratingOption: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  ratingOptionActive: {
    backgroundColor: THEME.accent,
    borderColor: THEME.accent,
  },
  ratingText: {
    color: THEME.textSec,
    fontWeight: '600',
    fontSize: 13,
  },
  ratingTextActive: {
    color: '#1a1a2e',
    fontWeight: 'bold',
  },

  // --- ALT BUTON ---
  bottomContainer: {
    marginTop: 'auto', // En alta itmek için
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  mainButton: {
    borderRadius: 25,
    elevation: 5,
    shadowColor: THEME.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  gradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 25,
  },
  btnText: {
    color: '#1a1a2e',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});