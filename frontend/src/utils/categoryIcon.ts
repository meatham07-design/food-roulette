/**
 * Restoran adına göre kategori ikonu döndürür
 */
export const getCategoryIcon = (name: string): string => {
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

