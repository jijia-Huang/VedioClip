import { ClipSegment, ClipValidationResult } from '../../shared/types';
import { VideoInfo } from '../../shared/types';

/**
 * 驗證服務
 * 處理片段驗證邏輯，避免 store 之間的直接依賴
 */
export const validationService = {
  /**
   * 驗證片段
   * @param segment 要驗證的片段（不包含 id）
   * @param videoInfo 影片資訊（可選，用於驗證時間範圍）
   * @returns 驗證結果
   */
  validateSegment(
    segment: Omit<ClipSegment, 'id'>,
    videoInfo: VideoInfo | null = null
  ): ClipValidationResult {
    // 驗證名稱
    if (!segment.name || segment.name.trim() === '') {
      return {
        valid: false,
        error: '片段名稱不能為空',
      };
    }

    // 驗證時間範圍
    if (segment.startTime < 0) {
      return {
        valid: false,
        error: '開始時間不能為負數',
      };
    }

    if (segment.endTime <= segment.startTime) {
      return {
        valid: false,
        error: '結束時間必須大於開始時間',
      };
    }

    // 驗證影片長度（如果提供了影片資訊）
    if (videoInfo) {
      if (segment.startTime >= videoInfo.duration) {
        return {
          valid: false,
          error: `開始時間不能超過影片長度（${videoInfo.duration.toFixed(2)} 秒）`,
        };
      }
      if (segment.endTime > videoInfo.duration) {
        return {
          valid: false,
          error: `結束時間不能超過影片長度（${videoInfo.duration.toFixed(2)} 秒）`,
        };
      }
    }

    return { valid: true };
  },
};
