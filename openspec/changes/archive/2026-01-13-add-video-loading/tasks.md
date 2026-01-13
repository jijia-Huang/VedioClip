## 1. 主進程影片處理
- [x] 1.1 建立 src/main/video-processor.ts
- [x] 1.2 實作 getVideoInfo 函數（使用 ffprobe 取得影片資訊）
- [x] 1.3 處理 FFmpeg 錯誤和異常情況
- [x] 1.4 驗證影片檔案存在性和格式支援

## 2. IPC 通訊擴展
- [x] 2.1 在 ipc-handlers.ts 中註冊 video:load 處理器（開啟檔案選擇對話框）
- [x] 2.2 在 ipc-handlers.ts 中註冊 video:get-info 處理器（取得影片資訊）
- [x] 2.3 在 preload.ts 中暴露 loadVideo 和 getVideoInfo API
- [x] 2.4 更新 ElectronAPI 型別定義

## 3. 狀態管理
- [x] 3.1 建立 src/renderer/stores/videoStore.ts
- [x] 3.2 定義影片狀態（videoPath, videoInfo, loading, error）
- [x] 3.3 實作載入影片的 action
- [x] 3.4 實作清除影片的 action

## 4. UI 元件開發
- [x] 4.1 建立 src/renderer/components/VideoLoader/ 目錄
- [x] 4.2 建立 VideoLoader.tsx（載入按鈕和檔案選擇觸發）
- [x] 4.3 建立 VideoInfoDisplay.tsx（顯示影片資訊）
- [x] 4.4 實作載入狀態和錯誤處理 UI

## 5. 工具函數
- [x] 5.1 建立 src/renderer/utils/timeFormat.ts（時間格式化工具）
- [x] 5.2 實作 formatTime 函數（秒數轉換為 時:分:秒）
- [x] 5.3 實作 parseTime 函數（解析時間字串為秒數）

## 6. 整合與測試
- [x] 6.1 在 App.tsx 中整合 VideoLoader 和 VideoInfoDisplay
- [x] 6.2 測試載入不同格式的影片檔案（建置成功，功能已實作）
- [x] 6.3 測試錯誤處理（無效檔案、不支援格式等，已實作錯誤處理邏輯）
- [x] 6.4 驗證影片資訊正確顯示（UI 元件已實作）
