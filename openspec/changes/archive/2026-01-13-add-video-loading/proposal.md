## Why
使用者需要能夠載入影片檔案並查看影片的基本資訊（時長、解析度、格式等），這是所有後續剪輯功能的基礎。目前專案只有基礎架構，還沒有任何影片處理功能。

## What Changes
- 在主進程實作 FFmpeg 影片資訊取得功能（video-processor.ts）
- 建立 IPC 處理器處理影片載入請求（video:load, video:get-info）
- 在渲染進程建立影片載入 UI（檔案選擇對話框、影片資訊顯示）
- 使用 Zustand 建立影片狀態管理（videoStore.ts）
- 更新 preload 腳本暴露影片相關 API
- 更新共享型別定義（VideoInfo 已存在，可能需要擴展）

## Impact
- Affected specs: 新增 `video-loading` capability
- Affected code:
  - `src/main/video-processor.ts` (新增)
  - `src/main/ipc-handlers.ts` (擴展)
  - `src/main/preload.ts` (擴展)
  - `src/renderer/stores/videoStore.ts` (新增)
  - `src/renderer/components/VideoLoader/` (新增)
  - `src/shared/types.ts` (可能需要擴展)
- 為後續剪輯功能提供基礎
