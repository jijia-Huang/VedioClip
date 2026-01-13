import { contextBridge, ipcRenderer } from 'electron';
import { IpcResponse, VideoInfo, ClipSegment, ExportSettings, BatchExportResult, ExportProgress } from '../shared/types';

/**
 * Preload 腳本
 * 在渲染進程中暴露安全的 Electron API
 */

// 定義暴露給渲染進程的 API 型別
export interface ElectronAPI {
  // 影片載入相關 API
  loadVideo: () => Promise<IpcResponse<string>>;
  getVideoInfo: (videoPath: string) => Promise<IpcResponse<VideoInfo>>;
  
  // 片段匯出相關 API
  selectExportDir: () => Promise<IpcResponse<string>>;
  exportClips: (
    videoUrl: string,
    segments: ClipSegment[],
    settings: ExportSettings
  ) => Promise<IpcResponse<BatchExportResult>>;
  
  // 匯出進度監聽
  onExportProgress: (callback: (progress: ExportProgress) => void) => void;
  removeExportProgressListener: () => void;
}

// 透過 contextBridge 暴露 API
contextBridge.exposeInMainWorld('electronAPI', {
  loadVideo: () => ipcRenderer.invoke('video:load'),
  getVideoInfo: (videoPath: string) =>
    ipcRenderer.invoke('video:get-info', videoPath),
  selectExportDir: () => ipcRenderer.invoke('export:select-dir'),
  exportClips: (videoUrl: string, segments: ClipSegment[], settings: ExportSettings) =>
    ipcRenderer.invoke('clip:export', videoUrl, segments, settings),
  onExportProgress: (callback: (progress: ExportProgress) => void) => {
    ipcRenderer.on('export:progress', (_event, progress: ExportProgress) => {
      callback(progress);
    });
  },
  removeExportProgressListener: () => {
    ipcRenderer.removeAllListeners('export:progress');
  },
} as ElectronAPI);
