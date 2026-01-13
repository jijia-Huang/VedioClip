import ffmpeg from 'fluent-ffmpeg';
import { existsSync } from 'fs';
import { dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { VideoInfo, ExportFormat, ExportQuality } from '../shared/types';

/**
 * 影片處理器
 * 使用 FFmpeg 處理影片相關操作
 */

// 在 ES 模組中定義 __dirname（fluent-ffmpeg 內部可能需要）
// 使用 globalThis 確保在運行時可用
if (typeof globalThis.__dirname === 'undefined') {
  const __filename = fileURLToPath(import.meta.url);
  globalThis.__dirname = dirname(__filename);
}

// 設定 FFmpeg 和 FFprobe 路徑
try {
  const require = createRequire(import.meta.url);
  
  // 設定 ffmpeg 路徑
  const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
  ffmpeg.setFfmpegPath(ffmpegInstaller.path);
  
  // 設定 ffprobe 路徑（使用 @ffprobe-installer/ffprobe）
  const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
  ffmpeg.setFfprobePath(ffprobeInstaller.path);
  
  console.log('FFmpeg 路徑:', ffmpegInstaller.path);
  console.log('FFprobe 路徑:', ffprobeInstaller.path);
} catch (error) {
  // 如果安裝器不可用，使用系統安裝的 FFmpeg
  console.warn('無法載入 FFmpeg/FFprobe 安裝器，使用系統安裝的版本:', error);
}

/**
 * 取得影片資訊
 * @param videoPath 影片檔案路徑
 * @returns 影片資訊
 * @throws 當檔案不存在或無法讀取時拋出錯誤
 */
export async function getVideoInfo(videoPath: string): Promise<VideoInfo> {
  // 驗證檔案存在
  if (!existsSync(videoPath)) {
    throw new Error(`影片檔案不存在: ${videoPath}`);
  }

  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(new Error(`無法讀取影片資訊: ${err.message}`));
        return;
      }

      // 取得影片串流資訊
      const videoStream = metadata.streams?.find(
        (stream) => stream.codec_type === 'video'
      );

      if (!videoStream) {
        reject(new Error('無法找到影片串流'));
        return;
      }

      // 解析影片資訊
      const videoInfo: VideoInfo = {
        duration: metadata.format.duration || 0,
        width: videoStream.width || 0,
        height: videoStream.height || 0,
        format: metadata.format.format_name || 'unknown',
        bitrate: metadata.format.bit_rate
          ? parseInt(String(metadata.format.bit_rate), 10)
          : 0,
      };

      // 驗證基本資訊
      if (videoInfo.duration === 0) {
        reject(new Error('無法取得影片時長'));
        return;
      }

      resolve(videoInfo);
    });
  });
}

/**
 * 驗證影片格式是否支援
 * @param videoPath 影片檔案路徑
 * @returns 是否支援
 */
export function isSupportedFormat(videoPath: string): boolean {
  const supportedExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv'];
  const extension = videoPath
    .toLowerCase()
    .substring(videoPath.lastIndexOf('.'));
  return supportedExtensions.includes(extension);
}


/**
 * 根據品質設定位元率
 */
function getBitrateForQuality(quality: ExportQuality): number {
  switch (quality) {
    case 'high':
      return 5000; // 5000k
    case 'medium':
      return 2500; // 2500k
    case 'low':
      return 1000; // 1000k
    default:
      return 5000;
  }
}

/**
 * 清理檔案名稱（移除無效字元）
 */
export function sanitizeFileName(fileName: string): string {
  // 移除或替換無效字元：/ \ : * ? " < > |
  return fileName
    .replace(/[/\\:*?"<>|]/g, '_')
    .trim();
}

/**
 * 匯出影片片段
 * @param videoPath 原始影片路徑
 * @param startTime 開始時間（秒）
 * @param duration 持續時間（秒）
 * @param outputPath 輸出檔案路徑
 * @param format 輸出格式
 * @param quality 輸出品質
 * @param onProgress 進度回調（可選）
 * @returns Promise<void>
 */
export async function exportClip(
  videoPath: string,
  startTime: number,
  duration: number,
  outputPath: string,
  format: ExportFormat,
  quality: ExportQuality,
  onProgress?: (progress: { percent: number }) => void
): Promise<void> {
  // 驗證檔案存在
  if (!existsSync(videoPath)) {
    throw new Error(`影片檔案不存在: ${videoPath}`);
  }

  // 驗證時間範圍
  if (startTime < 0 || duration <= 0) {
    throw new Error('無效的時間範圍');
  }

  return new Promise((resolve, reject) => {
    const command = ffmpeg(videoPath)
      .setStartTime(startTime)
      .setDuration(duration)
      .output(outputPath);

    // 根據格式設定編碼器
    switch (format) {
      case 'mp4':
        if (quality === 'high') {
          // 嘗試使用 copy（如果格式相同）
          const originalExt = extname(videoPath).toLowerCase();
          if (originalExt === '.mp4') {
            command.videoCodec('copy').audioCodec('copy');
          } else {
            command.videoCodec('libx264').audioCodec('aac');
            command.videoBitrate(getBitrateForQuality(quality));
          }
        } else {
          command.videoCodec('libx264').audioCodec('aac');
          command.videoBitrate(getBitrateForQuality(quality));
        }
        break;
      case 'avi':
        command.videoCodec('libx264').audioCodec('libmp3lame');
        command.videoBitrate(getBitrateForQuality(quality));
        break;
      case 'mov':
        command.videoCodec('libx264').audioCodec('aac');
        command.videoBitrate(getBitrateForQuality(quality));
        break;
      case 'mkv':
        command.videoCodec('libx264').audioCodec('aac');
        command.videoBitrate(getBitrateForQuality(quality));
        break;
      case 'webm':
        command.videoCodec('libvpx-vp9').audioCodec('libopus');
        command.videoBitrate(getBitrateForQuality(quality));
        break;
    }

    // 設定進度回調
    if (onProgress) {
      command.on('progress', (progress) => {
        onProgress({ percent: progress.percent || 0 });
      });
    }

    // 執行轉換
    command.on('end', () => {
      // 驗證輸出檔案存在
      if (!existsSync(outputPath)) {
        reject(new Error('匯出失敗：輸出檔案不存在'));
        return;
      }
      resolve();
    });

    command.on('error', (err) => {
      reject(new Error(`匯出失敗: ${err.message}`));
    });

    command.run();
  });
}
