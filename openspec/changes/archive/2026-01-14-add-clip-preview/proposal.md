## Why
使用者在管理多個剪輯片段時，需要能夠快速確認每個片段的開始和結束位置是否正確。目前只能手動在進度條上尋找時間點，效率較低。提供「預覽片段」功能可以讓使用者一鍵跳轉到片段起點並開始播放。

## What Changes
- 在片段列表（ClipList）的每個片段操作列中新增「預覽」按鈕。
- 在影片播放器（VideoPlayer）中實作接收跳轉請求的邏輯。
- 更新 `videoStore` 狀態管理，新增支援外部元件請求跳轉和播放的功能。
- 在影片播放器上方新增顯示當前預覽片段名稱的區域（或顯示「原影片」）。
- 在影片播放器控制區新增「返回原影片」按鈕，用於切換回完整影片播放模式。
- **MODIFIED**: 影片播放控制，支援設定特定時間點跳轉和預覽模式切換。

## Impact
- Affected specs: `clip-preview` (New), `ui-layout` (Modified)
- Affected code:
    - `src/renderer/stores/videoStore.ts`: 新增跳轉請求狀態和當前預覽片段資訊。
    - `src/renderer/components/VideoPlayer/VideoPlayer.tsx`: 監聽跳轉請求並執行，新增片段名稱顯示和返回原影片按鈕。
    - `src/renderer/components/ClipList/ClipList.tsx`: 新增預覽按鈕。
