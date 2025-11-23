/**
 * Formatlama yardımcı fonksiyonları
 */

/**
 * Metre cinsinden mesafeyi formatlar
 * @param meters - Metre cinsinden mesafe
 * @returns Formatlanmış mesafe string'i (örn: "500 m" veya "1.5 km")
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

/**
 * Tarih string'ini göreceli zaman formatına çevirir
 * @param dateString - ISO tarih string'i
 * @returns Göreceli zaman string'i (örn: "5 dakika önce", "2 saat önce")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Az önce';
  if (minutes < 60) return `${minutes} dakika önce`;
  if (hours < 24) return `${hours} saat önce`;
  if (days < 7) return `${days} gün önce`;
  
  return date.toLocaleDateString('tr-TR');
};

