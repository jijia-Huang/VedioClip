## Context
需要實作影片載入功能，讓使用者能夠選擇影片檔案並查看基本資訊。這是後續所有剪輯功能的基礎。使用 FFmpeg 的 ffprobe 來取得影片資訊，透過 IPC 在主進程和渲染進程之間通訊。

## Goals / Non-Goals
- Goals:
  - 使用者可以透過檔案選擇對話框載入影片
  - 顯示影片的基本資訊（時長、解析度、格式、位元率）
  - 處理載入錯誤和無效檔案
  - 為後續功能提供影片狀態管理基礎

- Non-Goals:
  - 不實作影片預覽播放（留待後續提案）
  - 不實作影片剪輯功能（留待後續提案）
  - 不實作批次載入多個檔案（留待後續擴充）

## Decisions
- Decision: 使用 fluent-ffmpeg 的 ffprobe 取得影片資訊
  - Alternatives considered: 直接使用 FFmpeg CLI、使用其他 Node.js 封裝
  - Rationale: fluent-ffmpeg 提供友善的 Promise-based API，已安裝在專案中

- Decision: 在主進程處理所有 FFmpeg 操作
  - Alternatives considered: 在渲染進程處理（需要 nodeIntegration）
  - Rationale: 符合 Electron 安全最佳實踐，避免暴露 Node.js API 給渲染進程

- Decision: 使用 Zustand 管理影片狀態
  - Alternatives considered: React Context、Redux
  - Rationale: 輕量級、簡單易用，符合專案約定

- Decision: 影片資訊使用共享型別定義
  - Alternatives considered: 分別在主進程和渲染進程定義
  - Rationale: 確保型別一致性，減少重複定義

## Risks / Trade-offs
- Risk: FFmpeg 未安裝或路徑不正確 → Mitigation: 提供明確的錯誤訊息，建議使用 @ffmpeg-installer/ffmpeg
- Risk: 大型影片檔案取得資訊可能較慢 → Mitigation: 顯示載入狀態，考慮非同步處理
- Risk: 不支援的影片格式 → Mitigation: 驗證格式，提供友善的錯誤訊息

## Migration Plan
不適用（新功能）

## Open Questions
- 是否需要支援拖放載入影片檔案？
  - 決定：先實作檔案選擇對話框，拖放功能留待後續擴充
