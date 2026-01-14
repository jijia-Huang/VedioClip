/**
 * 影片品質相關常量
 */

import { ExportQuality } from '../types';

/**
 * 品質位元率對應表（單位：kbps）
 */
export const QUALITY_BITRATES: Record<ExportQuality, number> = {
  high: 5000,   // 5000k
  medium: 2500, // 2500k
  low: 1000,    // 1000k
} as const;

/**
 * 根據品質獲取位元率
 * @param quality 輸出品質
 * @returns 位元率（kbps）
 */
export function getBitrateForQuality(quality: ExportQuality): number {
  return QUALITY_BITRATES[quality];
}
