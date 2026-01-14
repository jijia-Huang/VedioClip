import ffmpeg from 'fluent-ffmpeg';
import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { dirname, extname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { app } from 'electron';
import { VideoInfo, ExportFormat, ExportQuality } from '../shared/types';

const execAsync = promisify(exec);

/**
 * 影片處理器
 * 使用 FFmpeg 處理影片相關操作
 */

// 在 ES 模組中定義 __dirname
if (typeof globalThis.__dirname === 'undefined') {
  const __filename = fileURLToPath(import.meta.url);
  globalThis.__dirname = dirname(__filename);
}

// 保存 ffmpeg 路徑供直接調用
let globalFfmpegPath: string = 'ffmpeg';

// 設定 FFmpeg 路徑
function setupFFmpegPaths() {
  let ffmpegPath: string;
  
  if (app.isPackaged) {
    // 打包後的路徑：從 resources 目錄讀取
    const resourcesPath = process.resourcesPath || join(dirname(process.execPath), 'resources');
    ffmpegPath = join(resourcesPath, 'ffmpeg.exe');
  } else {
    // 開發模式：使用 node_modules 中的安裝器
    try {
      const require = createRequire(import.meta.url);
      const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
      ffmpegPath = ffmpegInstaller.path;
    } catch (error) {
      console.warn('無法載入 FFmpeg 安裝器:', error);
      ffmpegPath = 'ffmpeg';
    }
  }
  
  globalFfmpegPath = ffmpegPath;
  ffmpeg.setFfmpegPath(ffmpegPath);
  
  console.log('FFmpeg 路徑:', ffmpegPath);
}

// 在 app ready 後初始化
export function initializeFFmpeg() {
  try {
    setupFFmpegPaths();
  } catch (error) {
    console.warn('設定 FFmpeg 路徑時發生錯誤:', error);
  }
}

/**
 * 取得影片資訊
 * @param videoPath 影片檔案路徑
 * @returns 影片資訊
 */
export async function getVideoInfo(videoPath: string): Promise<VideoInfo> {
  if (!existsSync(videoPath)) {
    throw new Error(`影片檔案不存在: ${videoPath}`);
  }

  try {
    // 使用 ffmpeg -i 取得資訊，它會輸出到 stderr
    // 使用雙引號包裹路徑以處理空格
    const { stderr } = await execAsync(`"${globalFfmpegPath}" -i "${videoPath}"`);
    return parseFfmpegOutput(stderr);
  } catch (error: any) {
    // ffmpeg -i 如果沒有輸出檔案通常會回傳 exit code 1，這是正常的
    if (error.stderr) {
      return parseFfmpegOutput(error.stderr);
    }
    throw new Error(`無法讀取影片資訊: ${error.message}`);
  }
}

/**
 * 解析 FFmpeg 輸出文字
 */
function parseFfmpegOutput(output: string): VideoInfo {
  const info: VideoInfo = {
    duration: 0,
    width: 0,
    height: 0,
    format: 'unknown',
    bitrate: 0
  };

  // 1. 解析時長 Duration: 00:00:05.12
  const durationMatch = output.match(/Duration: (\d{2}):(\d{2}):(\d{2})\.(\d{2})/);
  if (durationMatch) {
    const hours = parseInt(durationMatch[1], 10);
    const minutes = parseInt(durationMatch[2], 10);
    const seconds = parseInt(durationMatch[3], 10);
    const centiseconds = parseInt(durationMatch[4], 10);
    info.duration = hours * 3600 + minutes * 60 + seconds + centiseconds / 100;
  }

  // 2. 解析解析度 1920x1080
  const videoMatch = output.match(/Video:.* (\d{2,5})x(\d{2,5})/);
  if (videoMatch) {
    info.width = parseInt(videoMatch[1], 10);
    info.height = parseInt(videoMatch[2], 10);
  }

  // 3. 解析格式
  const formatMatch = output.match(/Input #0, ([^,]+),/);
  if (formatMatch) {
    info.format = formatMatch[1];
  }

  // 4. 解析位元率 bitrate: 2265 kb/s
  const bitrateMatch = output.match(/bitrate: (\d+) kb\/s/);
  if (bitrateMatch) {
    info.bitrate = parseInt(bitrateMatch[1], 10) * 1000;
  }

  if (info.duration === 0) {
    throw new Error('無法從 FFmpeg 輸出中解析影片資訊');
  }

  return info;
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
