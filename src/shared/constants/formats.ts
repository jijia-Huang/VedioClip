/**
 * 影片格式相關常量
 */

import { ExportFormat } from '../types';

/**
 * 支援的影片格式列表（用於類型定義）
 */
export const SUPPORTED_FORMATS: readonly ExportFormat[] = [
  'mp4',
  'avi',
  'mov',
  'mkv',
  'webm',
] as const;

/**
 * 支援的影片副檔名列表（包含點號前綴，用於檔案驗證）
 */
export const SUPPORTED_EXTENSIONS: readonly string[] = [
  '.mp4',
  '.avi',
  '.mov',
  '.mkv',
  '.webm',
  '.flv', // 支援讀取但不支援匯出
] as const;

/**
 * 檔案選擇對話框使用的格式過濾器（不包含點號前綴）
 */
export const FILE_DIALOG_EXTENSIONS: readonly string[] = [
  'mp4',
  'avi',
  'mov',
  'mkv',
  'webm',
  'flv',
] as const;
