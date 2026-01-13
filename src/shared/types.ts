/**
 * 共享型別定義
 * 供主進程和渲染進程使用
 */

// IPC 通訊相關型別
export interface IpcResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// 影片資訊型別（預留，後續功能開發時擴展）
export interface VideoInfo {
  duration: number;
  width: number;
  height: number;
  format: string;
  bitrate: number;
}

// 剪輯片段型別
export interface ClipSegment {
  id: string; // 唯一識別碼
  name: string; // 片段名稱
  startTime: number; // 開始時間（秒）
  endTime: number; // 結束時間（秒）
}

// 片段驗證結果
export interface ClipValidationResult {
  valid: boolean;
  error?: string;
}

// 輸出格式
export type ExportFormat = 'mp4' | 'avi' | 'mov' | 'mkv' | 'webm';

// 輸出品質
export type ExportQuality = 'high' | 'medium' | 'low';

// 匯出設定
export interface ExportSettings {
  outputDir: string;
  format: ExportFormat;
  quality: ExportQuality;
}

// 匯出進度
export interface ExportProgress {
  currentIndex: number;
  total: number;
  currentSegmentName: string;
  percentage: number;
}

// 匯出結果
export interface ExportResult {
  success: boolean;
  outputPath?: string;
  error?: string;
}

// 批次匯出結果
export interface BatchExportResult {
  total: number;
  success: number;
  failed: number;
  results: Array<{
    segmentId: string;
    segmentName: string;
    result: ExportResult;
  }>;
}
