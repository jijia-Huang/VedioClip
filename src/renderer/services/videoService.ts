import { VideoInfo } from '../../shared/types';
import { ElectronAPI } from '../../main/preload';

/**
 * 自定義錯誤類別
 */
export class VideoLoadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VideoLoadError';
  }
}

export class VideoInfoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VideoInfoError';
  }
}

// 擴展 Window 介面以包含 electronAPI
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

/**
 * 影片服務
 * 統一處理影片載入和資訊獲取的 IPC 通訊
 */
export const videoService = {
  /**
   * 載入影片檔案
   * @returns 影片的 file:// URL
   * @throws VideoLoadError 當載入失敗時
   */
  async loadVideo(): Promise<string> {
    if (!window.electronAPI) {
      throw new VideoLoadError('Electron API 未初始化');
    }

    try {
      const result = await window.electronAPI.loadVideo();
      
      if (!result.success || !result.data) {
        throw new VideoLoadError(result.error || '載入影片失敗');
      }
      
      return result.data;
    } catch (error) {
      if (error instanceof VideoLoadError) {
        throw error;
      }
      throw new VideoLoadError(
        error instanceof Error ? error.message : '載入影片時發生未知錯誤'
      );
    }
  },

  /**
   * 取得影片資訊
   * @param videoUrl 影片的 file:// URL
   * @returns 影片資訊
   * @throws VideoInfoError 當取得資訊失敗時
   */
  async getVideoInfo(videoUrl: string): Promise<VideoInfo> {
    if (!window.electronAPI) {
      throw new VideoInfoError('Electron API 未初始化');
    }

    try {
      const result = await window.electronAPI.getVideoInfo(videoUrl);
      
      if (!result.success || !result.data) {
        throw new VideoInfoError(result.error || '無法取得影片資訊');
      }
      
      return result.data;
    } catch (error) {
      if (error instanceof VideoInfoError) {
        throw error;
      }
      throw new VideoInfoError(
        error instanceof Error ? error.message : '取得影片資訊時發生未知錯誤'
      );
    }
  },
};
