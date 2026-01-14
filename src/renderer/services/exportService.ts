import { ClipSegment, ExportSettings, BatchExportResult, ExportProgress } from '../../shared/types';
import { ElectronAPI } from '../../main/preload';

/**
 * 自定義錯誤類別
 */
export class ExportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExportError';
  }
}

export class DirectorySelectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DirectorySelectionError';
  }
}

// 擴展 Window 介面以包含 electronAPI
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

/**
 * 匯出服務
 * 統一處理片段匯出相關的 IPC 通訊
 */
export const exportService = {
  /**
   * 選擇輸出目錄
   * @returns 輸出目錄路徑
   * @throws DirectorySelectionError 當選擇失敗時（不包括使用者取消）
   */
  async selectExportDir(): Promise<string> {
    if (!window.electronAPI) {
      throw new DirectorySelectionError('Electron API 未初始化');
    }

    try {
      const result = await window.electronAPI.selectExportDir();
      
      if (!result.success || !result.data) {
        // 使用者取消選擇不算錯誤，返回空字串
        if (result.error === '使用者取消選擇') {
          return '';
        }
        throw new DirectorySelectionError(result.error || '選擇目錄失敗');
      }
      
      return result.data;
    } catch (error) {
      if (error instanceof DirectorySelectionError) {
        throw error;
      }
      throw new DirectorySelectionError(
        error instanceof Error ? error.message : '選擇目錄時發生未知錯誤'
      );
    }
  },

  /**
   * 匯出片段
   * @param videoUrl 影片的 file:// URL
   * @param segments 要匯出的片段列表
   * @param settings 匯出設定
   * @returns 批次匯出結果
   * @throws ExportError 當匯出失敗時
   */
  async exportClips(
    videoUrl: string,
    segments: ClipSegment[],
    settings: ExportSettings
  ): Promise<BatchExportResult> {
    if (!window.electronAPI) {
      throw new ExportError('Electron API 未初始化');
    }

    try {
      const result = await window.electronAPI.exportClips(videoUrl, segments, settings);
      
      if (!result.success || !result.data) {
        throw new ExportError(result.error || '匯出失敗');
      }
      
      return result.data;
    } catch (error) {
      if (error instanceof ExportError) {
        throw error;
      }
      throw new ExportError(
        error instanceof Error ? error.message : '匯出時發生未知錯誤'
      );
    }
  },

  /**
   * 監聽匯出進度
   * @param callback 進度回調函數
   * @returns 清理函數，用於移除監聽器
   */
  onExportProgress(callback: (progress: ExportProgress) => void): () => void {
    if (!window.electronAPI) {
      return () => {};
    }

    window.electronAPI.onExportProgress(callback);
    
    return () => {
      window.electronAPI.removeExportProgressListener();
    };
  },
};
