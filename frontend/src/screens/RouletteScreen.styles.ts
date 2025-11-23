import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;
const scale = (size: number) => (isSmallScreen ? size * 0.9 : size);

export const WHEEL_SIZE = width * 0.85; 

export const THEME = {
  background: '#1a1a2e',
  textMain: '#FFFFFF',
  textSec: 'rgba(255, 255, 255, 0.6)',
  accent: '#FFD700',
  cardBg: '#222233',
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
    paddingVertical: scale(20),
    alignItems: 'center',
  },
  
  // --- GERİ BUTONU ---
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    zIndex: 100,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // --- HEADER ---
  header: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: scale(28),
    fontWeight: '800',
    color: THEME.textMain,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: scale(14),
    color: THEME.textSec,
    marginTop: 5,
  },

  // --- ÇARK YAPISI ---
  wheelContainer: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(25),
    position: 'relative',
  },
  pointerContainer: {
    position: 'absolute',
    top: -25,
    zIndex: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  wheelWrapper: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    borderWidth: 8,
    borderColor: '#333',
    backgroundColor: '#333',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  wheel: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: WHEEL_SIZE / 2,
    backgroundColor: '#2a2a40',
  },
  centerHub: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#e0e0e0',
    zIndex: 20,
    elevation: 5,
  },

  // --- DİLİMLER ---
  segmentContainer: {
    position: 'absolute',
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  segmentLine: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    position: 'absolute',
    top: 0,
  },
  segmentContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 200,
    height: 40,
    marginTop: -20,
    marginLeft: -100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentInnerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    transform: [{ rotate: '-90deg' }],
    width: '100%',
    paddingLeft: 40,
  },
  segmentText: {
    color: '#fff',
    fontSize: scale(11),
    fontWeight: '600',
    marginRight: 8,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 2,
  },
  segmentNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  segmentNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 2,
  },

  // --- BUTON (SPIN) ---
  spinButton: {
    marginBottom: scale(15), // Altına Control Bar gelecek
    width: '60%',
    borderRadius: 30,
    elevation: 5,
    shadowColor: THEME.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  spinButtonDisabled: {
    opacity: 0.7,
  },
  spinButtonGradient: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinButtonText: {
    color: '#1a1a2e',
    fontSize: scale(18),
    fontWeight: 'bold',
    letterSpacing: 2,
  },

  // --- CONTROL BAR (Yeni Eklenen Şık Alan) ---
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  infoText: {
    color: THEME.textSec,
    fontSize: scale(12),
    marginLeft: 6,
    fontWeight: '600',
  },
  miniShuffleButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  miniShuffleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: THEME.accent,
    borderRadius: 20,
  },
  miniShuffleText: {
    color: THEME.accent,
    fontSize: scale(12),
    fontWeight: 'bold',
    marginLeft: 4,
  },

  // --- LİSTE (LEGEND) ---
  legendContainer: {
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  legendHeader: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    paddingBottom: 8,
  },
  legendTitle: {
    color: THEME.textSec,
    fontSize: scale(12),
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  legendColorBox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  legendNumber: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  legendName: {
    color: THEME.textMain,
    fontSize: 14,
    flex: 1,
  },

  // --- MODAL ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.accent,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
  },
  winnerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.accent,
    letterSpacing: 3,
    marginBottom: 20,
  },
  modalImageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: THEME.accent,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: THEME.textMain,
    textAlign: 'center',
    marginBottom: 10,
  },
  modalAddress: {
    fontSize: 14,
    color: THEME.textSec,
    textAlign: 'center',
    marginBottom: 30,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    width: '100%',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: THEME.accent,
    width: 64,
    height: 64,
    borderRadius: 32,
    marginTop: -15,
    elevation: 5,
    shadowColor: THEME.accent,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  actionText: {
    fontSize: 11,
    color: THEME.textSec,
    marginTop: 5,
  },
});