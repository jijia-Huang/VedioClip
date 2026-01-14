import { ipcMain, dialog, BrowserWindow } from 'electron';
import { getVideoInfo, isSupportedFormat, exportClip, sanitizeFileName } from './video-processor';
import { IpcResponse, VideoInfo, ClipSegment, ExportSettings, ExportProgress, BatchExportResult } from '../shared/types';
import { pathToFileURL } from 'url';
import { join } from 'path';
import { existsSync } from 'fs';
import { fileUrlToPath } from './utils/pathUtils';
import { FILE_DIALOG_EXTENSIONS } from '../shared/constants';
import { log } from './utils/logger';

/**
 * IPC 處理器
 * 處理來自渲染進程的 IPC 請求
 */

// 註冊 IPC 處理器
export function registerIpcHandlers() {
  // 載入影片檔案（開啟檔案選擇對話框）
  ipcMain.handle('video:load', async (): Promise<IpcResponse<string>> => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
          {
            name: '影片檔案',
            extensions: [...FILE_DIALOG_EXTENSIONS],
          },
        ],
      });

      if (result.canceled || result.filePaths.length === 0) {
        return {
          success: false,
          error: '使用者取消選擇',
        };
      }

      const videoPath = result.filePaths[0];

      // 驗證格式
      if (!isSupportedFormat(videoPath)) {
        return {
          success: false,
          error: '不支援的影片格式',
        };
      }

      // 將檔案路徑轉換為 file:// URL，以便在渲染進程中使用
      // 使用 pathToFileURL 並確保正確編碼
      const videoUrl = pathToFileURL(videoPath).href;

      return {
        success: true,
        data: videoUrl,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知錯誤',
      };
    }
  });

  // 取得影片資訊
  ipcMain.handle(
    'video:get-info',
    async (_event, videoUrl: string): Promise<IpcResponse<VideoInfo>> => {
      try {
        // 將 file:// URL 轉換回檔案路徑
        const videoPath = fileUrlToPath(videoUrl);
        
        const videoInfo = await getVideoInfo(videoPath);
        return {
          success: true,
          data: videoInfo,
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : '無法取得影片資訊',
        };
      }
    }
  );

  // 匯出片段
  ipcMain.handle(
    'clip:export',
    async (
      _event,
      videoUrl: string,
      segments: ClipSegment[],
      settings: ExportSettings
    ): Promise<IpcResponse<BatchExportResult>> => {
      try {
        // 將 file:// URL 轉換回檔案路徑
        const videoPath = fileUrlToPath(videoUrl);

        // 驗證影片檔案存在
        if (!existsSync(videoPath)) {
          return {
            success: false,
            error: '影片檔案不存在',
          };
        }

        // 驗證輸出目錄
        if (!existsSync(settings.outputDir)) {
          return {
            success: false,
            error: '輸出目錄不存在',
          };
        }

        const results: BatchExportResult['results'] = [];
        let successCount = 0;
        let failedCount = 0;

        // 批次匯出片段
        for (let i = 0; i < segments.length; i++) {
          const segment = segments[i];
          const duration = segment.endTime - segment.startTime;

          // 生成檔案名稱
          const baseName = segment.name || `clip_${i + 1}`;
          const sanitizedName = sanitizeFileName(baseName);
          const extension = `.${settings.format}`;
          let outputFileName = `${sanitizedName}${extension}`;
          let outputPath = join(settings.outputDir, outputFileName);

          // 處理檔案名稱衝突
          let counter = 1;
          while (existsSync(outputPath)) {
            outputFileName = `${sanitizedName}_${counter}${extension}`;
            outputPath = join(settings.outputDir, outputFileName);
            counter++;
          }

          // 發送進度更新
          const progress: ExportProgress = {
            currentIndex: i + 1,
            total: segments.length,
            currentSegmentName: segment.name,
            percentage: Math.round(((i + 1) / segments.length) * 100),
          };

          // 取得主視窗並發送進度事件
          const windows = BrowserWindow.getAllWindows();
          if (windows.length > 0) {
            windows[0].webContents.send('export:progress', progress);
          }

          try {
            // 匯出片段
            await exportClip(
              videoPath,
              segment.startTime,
              duration,
              outputPath,
              settings.format,
              settings.quality
            );

            results.push({
              segmentId: segment.id,
              segmentName: segment.name,
              result: {
                success: true,
                outputPath,
              },
            });
            successCount++;
          } catch (error) {
            results.push({
              segmentId: segment.id,
              segmentName: segment.name,
              result: {
                success: false,
                error: error instanceof Error ? error.message : '未知錯誤',
              },
            });
            failedCount++;
          }
        }

        return {
          success: true,
          data: {
            total: segments.length,
            success: successCount,
            failed: failedCount,
            results,
          },
        };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : '匯出失敗',
        };
      }
    }
  );

  // 選擇輸出目錄
  ipcMain.handle('export:select-dir', async (): Promise<IpcResponse<string>> => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
      });

      if (result.canceled || result.filePaths.length === 0) {
        return {
          success: false,
          error: '使用者取消選擇',
        };
      }

      return {
        success: true,
        data: result.filePaths[0],
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知錯誤',
      };
    }
  });

  // 日誌處理器
  ipcMain.handle('log:write', async (_event, level: 'debug' | 'info' | 'warn' | 'error', message: string) => {
    try {
      switch (level) {
        case 'debug':
          log.debug(message);
          break;
        case 'info':
          log.info(message);
          break;
        case 'warn':
          log.warn(message);
          break;
        case 'error':
          log.error(message);
          break;
      }
    } catch (error) {
      // 如果日誌記錄失敗，至少輸出到控制台
      console.error('日誌記錄失敗:', error);
    }
  });

  ipcMain.handle('log:error', async (_event, params: { message: string; stack?: string; componentStack?: string }) => {
    try {
      const errorMessage = `錯誤: ${params.message}${params.stack ? `\n堆疊: ${params.stack}` : ''}${params.componentStack ? `\n組件堆疊: ${params.componentStack}` : ''}`;
      log.error(errorMessage);
    } catch (error) {
      console.error('錯誤日誌記錄失敗:', error);
    }
  });
}
