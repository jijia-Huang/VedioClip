## 1. 專案結構建立
- [x] 1.1 建立 src/main 目錄（Electron 主進程）
- [x] 1.2 建立 src/renderer 目錄（React 渲染進程）
- [x] 1.3 建立 src/shared 目錄（共享型別定義）
- [x] 1.4 建立 dist 目錄（建置輸出）

## 2. 依賴管理設定
- [x] 2.1 建立 package.json 並定義專案基本資訊
- [x] 2.2 安裝核心依賴（electron, react, react-dom, typescript）
- [x] 2.3 安裝 FFmpeg 相關依賴（fluent-ffmpeg, @ffmpeg-installer/ffmpeg）
- [x] 2.4 安裝狀態管理依賴（zustand）
- [x] 2.5 安裝 UI 框架依賴（tailwindcss）
- [x] 2.6 安裝開發依賴（vite, electron-builder, @types/*）
- [x] 2.7 設定 npm scripts（dev, build, package）

## 3. TypeScript 配置
- [x] 3.1 建立 tsconfig.json 基礎配置
- [x] 3.2 設定主進程和渲染進程的 TypeScript 路徑別名
- [x] 3.3 配置型別檢查規則

## 4. 建置工具設定
- [x] 4.1 建立 Vite 配置檔案（vite.config.ts）
- [x] 4.2 設定 Electron 主進程和渲染進程的建置目標
- [x] 4.3 建立 electron-builder 配置檔案
- [x] 4.4 設定應用程式基本資訊（名稱、版本、圖示等）

## 5. Electron 主進程基礎
- [x] 5.1 建立 src/main/main.ts（主進程入口）
- [x] 5.2 實作基本的 BrowserWindow 建立邏輯
- [x] 5.3 設定 contextIsolation 和 preload 腳本
- [x] 5.4 建立基本的應用程式生命週期處理

## 6. IPC 通訊基礎
- [x] 6.1 建立 preload 腳本（src/main/preload.ts）
- [x] 6.2 設定 contextBridge 暴露安全的 API
- [x] 6.3 建立 IPC 處理器基礎結構（src/main/ipc-handlers.ts）

## 7. React 渲染進程基礎
- [x] 7.1 建立 src/renderer/index.html（實際為根目錄的 index.html）
- [x] 7.2 建立 src/renderer/main.tsx（React 入口）
- [x] 7.3 建立 src/renderer/App.tsx（根元件）
- [x] 7.4 設定基本的 React 渲染邏輯

## 8. 共享型別定義
- [x] 8.1 建立 src/shared/types.ts
- [x] 8.2 定義基本的 IPC 通訊型別

## 9. 開發環境驗證
- [x] 9.1 驗證開發模式可以正常啟動（npm run dev）
- [x] 9.2 驗證建置流程可以正常執行（npm run build）
- [x] 9.3 驗證打包流程可以正常執行（npm run package）
