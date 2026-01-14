## Why
使用者在預覽片段或觀看完整影片時，經常需要重複播放同一段內容來確認細節。目前需要手動在播放結束後重新點擊播放按鈕，效率較低。提供循環播放功能可以讓使用者一鍵啟用自動重複播放，提升使用體驗。

## What Changes
- 在影片播放器控制區新增「循環播放」按鈕（位於時間軸附近）。
- 在 `videoStore` 中新增 `loop` 狀態和 `toggleLoop` 方法。
- 實作循環播放邏輯：
  - 一般模式：播放到影片結束時自動跳回 0 秒並繼續播放。
  - 預覽模式：播放到片段結束時自動跳回片段開始時間並繼續播放。
- 循環按鈕視覺狀態：啟用時高亮顯示，未啟用時為一般樣式。

## Impact
- Affected specs: `video-preview` (Modified)
- Affected code:
    - `src/renderer/stores/videoStore.ts`: 新增循環播放狀態管理。
    - `src/renderer/components/VideoPlayer/VideoPlayer.tsx`: 新增循環按鈕和循環播放邏輯。
