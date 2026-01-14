import { describe, it, expect, beforeEach } from 'vitest';
import { fileUrlToPath } from './pathUtils';

describe('fileUrlToPath', () => {
  const originalPlatform = process.platform;

  beforeEach(() => {
    // 重置 process.platform
    Object.defineProperty(process, 'platform', {
      value: originalPlatform,
      writable: true,
      configurable: true,
    });
  });

  it('應該正確轉換 Windows file:// URL', () => {
    Object.defineProperty(process, 'platform', {
      value: 'win32',
      writable: true,
      configurable: true,
    });

    expect(fileUrlToPath('file:///C:/path/to/file.mp4')).toBe('C:/path/to/file.mp4');
    expect(fileUrlToPath('file:///D:/Videos/test.avi')).toBe('D:/Videos/test.avi');
    expect(fileUrlToPath('file:///C:/Users/Test/Desktop/video.mkv')).toBe('C:/Users/Test/Desktop/video.mkv');
  });

  it('應該正確轉換 Unix file:// URL', () => {
    Object.defineProperty(process, 'platform', {
      value: 'linux',
      writable: true,
      configurable: true,
    });

    expect(fileUrlToPath('file:///home/user/video.mp4')).toBe('/home/user/video.mp4');
    expect(fileUrlToPath('file:///usr/local/videos/test.avi')).toBe('/usr/local/videos/test.avi');
  });

  it('應該正確處理 URL 編碼的路徑', () => {
    Object.defineProperty(process, 'platform', {
      value: 'win32',
      writable: true,
      configurable: true,
    });

    // 包含空格的路徑
    expect(fileUrlToPath('file:///C:/My%20Videos/test.mp4')).toBe('C:/My Videos/test.mp4');
    
    // 包含中文字符的路徑
    expect(fileUrlToPath('file:///C:/%E8%A7%86%E9%A2%91/video.mp4')).toBe('C:/視頻/video.mp4');
  });

  it('應該正確處理 macOS file:// URL', () => {
    Object.defineProperty(process, 'platform', {
      value: 'darwin',
      writable: true,
      configurable: true,
    });

    expect(fileUrlToPath('file:///Users/test/video.mp4')).toBe('/Users/test/video.mp4');
    expect(fileUrlToPath('file:///Volumes/External/video.mkv')).toBe('/Volumes/External/video.mkv');
  });
});
