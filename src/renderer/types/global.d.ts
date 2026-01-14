import { ElectronAPI } from '../../main/preload';

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
  
  // Vite 注入的應用程式版本號
  const __APP_VERSION__: string;
}

export {};
