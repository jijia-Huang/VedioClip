## Why
使用者需要能夠預覽載入的影片，包括播放、暫停、跳轉到指定時間等功能。這是建立剪輯片段的重要基礎，因為使用者需要能夠看到影片內容才能準確選擇片段的開始和結束時間。目前系統只能載入影片並顯示資訊，還無法播放和預覽影片。

## What Changes
- 建立影片播放器 UI 元件（VideoPlayer）
- 實作播放/暫停控制
- 實作時間顯示（當前時間/總時長）
- 實作進度條和時間跳轉功能
- 整合影片狀態管理（使用現有的 videoStore）
- 實作基本的播放控制（音量、全螢幕等，可選）

## Impact
- Affected specs: 新增 `video-preview` capability
- Affected code:
  - `src/renderer/components/VideoPlayer/` (新增)
  - `src/renderer/stores/videoStore.ts` (擴展，新增播放狀態)
  - `src/renderer/App.tsx` (整合 VideoPlayer 元件)
- 為片段管理功能提供預覽基礎
