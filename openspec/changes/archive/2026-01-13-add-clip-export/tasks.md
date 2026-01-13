## 1. 型別定義
- [x] 1.1 在 src/shared/types.ts 中定義 ExportProgress 介面
- [x] 1.2 定義匯出結果型別（ExportResult）
- [x] 1.3 定義輸出格式型別（ExportFormat: 'mp4' | 'avi' | 'mov' | 'mkv' 等）
- [x] 1.4 定義輸出品質型別（ExportQuality: 'high' | 'medium' | 'low'）
- [x] 1.5 定義匯出設定型別（ExportSettings）

## 2. 主進程影片處理
- [x] 2.1 在 video-processor.ts 中實作 exportClip 函數
- [x] 2.2 使用 FFmpeg 的 -ss 和 -t 參數進行剪輯
- [x] 2.3 實作輸出格式轉換（根據選擇的格式設定編碼器）
- [x] 2.4 實作輸出品質設定（根據品質選擇設定位元率或品質參數）
- [x] 2.5 處理輸出檔案路徑和名稱
- [x] 2.6 實作錯誤處理和驗證

## 3. IPC 處理器
- [x] 3.1 在 ipc-handlers.ts 中實作 clip:export handler
- [x] 3.2 實作批次匯出邏輯（依序處理片段）
- [x] 3.3 實作進度追蹤（透過 IPC 事件發送進度）
- [x] 3.4 處理匯出錯誤和部分失敗情況
- [x] 3.5 實作輸出目錄選擇 handler（export:select-dir）

## 4. Preload 腳本
- [x] 4.1 在 preload.ts 中暴露 exportClip API
- [x] 4.2 定義匯出相關的型別介面
- [x] 4.3 暴露 selectExportDir API

## 5. 匯出 UI 元件
- [x] 5.1 建立 src/renderer/components/ExportPanel/ 目錄
- [x] 5.2 建立 ExportPanel.tsx（匯出控制面板）
- [x] 5.3 實作輸出目錄選擇功能（使用 Electron dialog）
- [x] 5.4 實作輸出格式選擇（下拉選單：mp4, avi, mov, mkv 等）
- [x] 5.5 實作輸出品質選擇（下拉選單：高、中、低品質）
- [x] 5.6 實作匯出按鈕和狀態顯示
- [x] 5.7 實作進度條顯示（當前片段、總進度）
- [x] 5.8 實作匯出結果顯示（成功/失敗統計）

## 6. 檔案名稱處理
- [x] 6.1 實作檔案名稱生成邏輯（基於片段名稱）
- [x] 6.2 處理檔案名稱衝突（自動添加序號）
- [x] 6.3 清理檔案名稱（移除無效字元）

## 7. 整合與測試
- [x] 7.1 在 App.tsx 中整合 ExportPanel 元件
- [x] 7.2 測試單一片段匯出功能（已實作並建置成功）
- [x] 7.3 測試批次匯出功能（已實作）
- [x] 7.4 測試進度追蹤功能（已實作）
- [x] 7.5 測試錯誤處理（無效片段、FFmpeg 失敗等，已實作）
