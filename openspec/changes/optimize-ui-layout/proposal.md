## Why
目前的 UI 佈局是垂直堆疊的單欄設計，所有元件（載入、預覽、片段列表、匯出）都垂直排列。這種設計在功能較少時還可以，但隨著功能增加，會導致頁面過長，使用者需要大量滾動才能看到所有功能。專業的影片編輯工具通常採用左右分欄佈局，左側是預覽視窗，右側是片段列表和輸出設定，這樣可以更有效地利用螢幕空間，提供更好的工作流程。

## What Changes
- 重新設計整體 UI 佈局為左右分欄結構
- 左側（65-70%）：影片預覽視窗和播放控制
- 右側（30-35%）：剪輯片段清單（表格形式）、輸出設定
- 頂部：標題列（Logo/標題、載入影片按鈕、設定、幫助）
- 底部：狀態列
- 優化片段列表為表格形式（顯示編號、名稱、開始時間、結束時間、操作）
- 實作「加入目前片段」功能（使用播放器的當前時間作為入點/出點）
- 實作入點/出點按鈕（I/O 按鈕）快速標記時間點
- 優化響應式設計，確保在不同視窗大小下都能良好顯示

## Impact
- Affected specs: 更新 `ui-layout` capability
- Affected code:
  - `src/renderer/App.tsx` (重構整體佈局)
  - `src/renderer/components/VideoPlayer/VideoPlayer.tsx` (優化為左側佈局)
  - `src/renderer/components/ClipList/ClipList.tsx` (改為表格形式)
  - `src/renderer/components/ExportPanel/ExportPanel.tsx` (整合到右側面板)
  - `src/renderer/components/VideoLoader/VideoLoader.tsx` (移到頂部標題列)
  - `src/renderer/components/Header/` (新增，頂部標題列)
  - `src/renderer/components/StatusBar/` (新增，底部狀態列)
  - `src/renderer/stores/clipStore.ts` (可能需要擴展，支援入點/出點)
- 大幅改善使用者體驗和工作流程效率
