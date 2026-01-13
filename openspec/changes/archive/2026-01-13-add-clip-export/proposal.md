## Why
使用者需要能夠將定義的剪輯片段匯出為獨立的影片檔案。這是影片剪輯工具的核心功能，使用者建立片段後需要能夠批次輸出這些片段。目前系統只能建立和管理片段，還無法實際剪輯和輸出影片。

## What Changes
- 在主進程實作 FFmpeg 影片剪輯功能（使用 fluent-ffmpeg）
- 建立 IPC 處理器處理片段匯出請求（clip:export）
- 實作批次匯出功能（依序處理多個片段）
- 建立匯出進度追蹤機制（透過 IPC 事件發送進度更新）
- 建立匯出 UI 元件（ExportPanel）
- 實作輸出設定（輸出目錄選擇、檔案名稱格式、輸出格式選擇、輸出品質設定）
- 更新 preload 腳本暴露匯出相關 API

## Impact
- Affected specs: 新增 `clip-export` capability
- Affected code:
  - `src/main/video-processor.ts` (擴展，新增 exportClip 函數)
  - `src/main/ipc-handlers.ts` (擴展，新增 clip:export handler)
  - `src/main/preload.ts` (擴展，新增 exportClip API)
  - `src/renderer/components/ExportPanel/` (新增)
  - `src/shared/types.ts` (可能需要擴展，新增 ExportProgress 型別)
- 完成影片剪輯工具的核心功能流程
