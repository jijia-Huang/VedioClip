import { app, BrowserWindow } from 'electron';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { registerIpcHandlers } from './ipc-handlers';

// 在 ES 模組中定義 __dirname
function getDirname() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    return dirname(__filename);
  } catch {
    // 如果 import.meta.url 不可用，使用 app.getAppPath()
    return app.isPackaged
      ? dirname(process.execPath)
      : app.getAppPath();
  }
}

const __dirname = getDirname();

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  // 取得 preload 腳本路徑
  const preloadPath = app.isPackaged
    ? join(__dirname, './preload.mjs')
    : join(__dirname, '../dist-electron/preload.mjs');

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
      webSecurity: false, // 允許載入本地檔案（file:// 協議）
    },
  });

  // 開發模式下載入 Vite 開發伺服器
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    // 生產模式下載入建置後的檔案
    const htmlPath = app.isPackaged
      ? join(__dirname, '../renderer/index.html')
      : join(__dirname, '../dist/index.html');
    mainWindow.loadFile(htmlPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // 註冊 IPC 處理器
  registerIpcHandlers();

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
