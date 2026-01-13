## Why
使用者需要能夠建立和管理多個剪輯片段（定義開始和結束時間），這是影片剪輯的核心功能。目前系統只能載入影片並顯示資訊，還無法建立和管理剪輯片段。

## What Changes
- 建立片段資料結構和型別定義（ClipSegment）
- 使用 Zustand 建立片段狀態管理（clipStore.ts）
- 建立片段列表 UI 元件（ClipList）
- 建立片段編輯表單元件（ClipEditor）
- 實作片段驗證邏輯（時間範圍驗證、重疊檢查等）
- 更新共享型別定義

## Impact
- Affected specs: 新增 `clip-management` capability
- Affected code:
  - `src/shared/types.ts` (擴展，新增 ClipSegment 型別)
  - `src/renderer/stores/clipStore.ts` (新增)
  - `src/renderer/components/ClipList/` (新增)
  - `src/renderer/components/ClipEditor/` (新增)
  - `src/renderer/utils/timeFormat.ts` (已存在，會使用)
- 為時間軸和輸出功能提供基礎
