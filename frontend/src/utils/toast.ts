import Toast from 'react-native-toast-message';

/**
 * Toast mesaj gösterimi için yardımcı fonksiyonlar
 */
export const showToast = {
  /**
   * Başarı mesajı gösterir
   */
  success: (message: string, title?: string) => {
    Toast.show({
      type: 'success',
      text1: title || 'Başarılı',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  },

  /**
   * Hata mesajı gösterir
   */
  error: (message: string, title?: string) => {
    Toast.show({
      type: 'error',
      text1: title || 'Hata',
      text2: message,
      position: 'top',
      visibilityTime: 4000,
    });
  },

  /**
   * Bilgi mesajı gösterir
   */
  info: (message: string, title?: string) => {
    Toast.show({
      type: 'info',
      text1: title || 'Bilgi',
      text2: message,
      position: 'top',
      visibilityTime: 3000,
    });
  },
};

