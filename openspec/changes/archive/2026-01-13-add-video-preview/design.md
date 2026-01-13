## Context
需要實作影片預覽功能，讓使用者能夠播放和預覽載入的影片。這是建立剪輯片段的重要基礎，因為使用者需要看到影片內容才能準確選擇片段的時間點。使用 HTML5 video 元素實現播放功能。

## Goals / Non-Goals
- Goals:
  - 使用者可以播放和暫停影片
  - 顯示當前播放時間和總時長
  - 可以透過進度條跳轉到指定時間
  - 基本的播放控制功能

- Non-Goals:
  - 不實作進階播放功能（字幕、多音軌等）
  - 不實作影片編輯功能（裁剪、濾鏡等）
  - 不實作縮圖預覽（留待後續擴充）
  - 不實作播放列表（單一影片預覽）

## Decisions
- Decision: 使用 HTML5 video 元素
  - Alternatives considered: 使用第三方播放器庫（如 video.js）
  - Rationale: HTML5 video 元素簡單易用，滿足基本需求，無需額外依賴

- Decision: 播放狀態使用本地元件狀態
  - Alternatives considered: 整合到 videoStore
  - Rationale: 播放狀態是 UI 相關的臨時狀態，不需要全局共享，使用本地狀態更簡單

- Decision: 影片路徑透過 videoStore 取得
  - Alternatives considered: 透過 props 傳遞
  - Rationale: 影片路徑是全局狀態，透過 store 存取更一致

- Decision: 使用原生 input range 作為進度條
  - Alternatives considered: 自訂進度條元件
  - Rationale: 原生元件簡單可靠，後續可根據需求自訂樣式

## Risks / Trade-offs
- Risk: 大型影片檔案載入可能較慢 → Mitigation: 顯示載入狀態，考慮使用預載入
- Risk: 不同影片格式相容性問題 → Mitigation: HTML5 video 支援主流格式，已在載入時驗證格式
- Risk: 播放效能問題 → Mitigation: 先實作基本功能，後續可優化

## Migration Plan
不適用（新功能）

## Open Questions
- 是否需要支援鍵盤快捷鍵（空格播放/暫停等）？
  - 決定：先實作基本功能，快捷鍵留待後續擴充
