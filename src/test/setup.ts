import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// 清理每個測試後的 DOM
afterEach(() => {
  cleanup();
});

// 模擬 Electron API（用於測試渲染進程代碼）
if (typeof window !== 'undefined') {
  (window as any).electronAPI = {
    loadVideo: vi.fn(),
    getVideoInfo: vi.fn(),
    selectExportDir: vi.fn(),
    exportClips: vi.fn(),
    onExportProgress: vi.fn(),
    removeExportProgressListener: vi.fn(),
    log: vi.fn(),
    logError: vi.fn(),
  };
}
