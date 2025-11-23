import { Colors } from '../constants/colors';
import { Gradients } from '../constants/gradients';

/**
 * Rulet segmenti için renk döndürür
 */
export const getRestaurantColor = (index: number): string => {
  return Colors.wheelColors[index % Colors.wheelColors.length];
};

/**
 * Rulet segmenti için gradient döndürür
 */
export const getRestaurantGradient = (index: number): [string, string] => {
  return Gradients.wheelSegments[index % Gradients.wheelSegments.length];
};

