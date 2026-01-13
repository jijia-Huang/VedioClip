## Context
需要實作片段匯出功能，讓使用者能夠將定義的剪輯片段批次輸出為獨立的影片檔案。使用 FFmpeg 在主進程執行剪輯操作，透過 IPC 與渲染進程通訊，並提供進度追蹤功能。

## Goals / Non-Goals
- Goals:
  - 使用者可以選擇輸出目錄
  - 批次匯出所有片段或選定的片段
  - 顯示匯出進度（當前片段、總進度）
  - 自動生成檔案名稱（基於片段名稱或索引）
  - 處理匯出錯誤和失敗情況
  - 匯出完成後提供反饋

- Non-Goals:
  - 不實作輸出解析度調整（使用原始解析度）
  - 不實作並行匯出（依序處理，避免資源競爭）
  - 不實作匯出暫停/恢復功能（留待後續擴充）
  - 不實作進階編碼參數設定（留待後續擴充）

## Decisions
- Decision: 使用 FFmpeg 的 `-ss` 和 `-t` 參數進行剪輯
  - Alternatives considered: 使用 `-ss` 和 `-to`、使用 filter_complex
  - Rationale: `-ss` 和 `-t` 簡單直接，適合基本剪輯需求，效能較好

- Decision: 在主進程執行所有 FFmpeg 操作
  - Alternatives considered: 在渲染進程處理、使用 Worker 執行緒
  - Rationale: 符合 Electron 安全最佳實踐，避免阻塞 UI（透過 IPC 事件非同步更新）

- Decision: 使用 IPC 事件發送進度更新
  - Alternatives considered: 輪詢檢查、使用 WebSocket
  - Rationale: IPC 事件是 Electron 標準通訊方式，簡單可靠

- Decision: 依序處理片段（不並行）
  - Alternatives considered: 並行處理多個片段
  - Rationale: 避免資源競爭，降低系統負載，更容易追蹤進度

- Decision: 檔案名稱使用片段名稱或自動生成
  - Alternatives considered: 使用者自訂格式、使用時間戳
  - Rationale: 片段名稱更直觀，自動生成確保唯一性

- Decision: 支援輸出格式選擇（mp4, avi, mov, mkv 等）
  - Alternatives considered: 僅支援原始格式、僅支援 mp4
  - Rationale: 提供格式選擇增加靈活性，滿足不同使用需求

- Decision: 支援輸出品質設定（高、中、低品質）
  - Alternatives considered: 僅使用原始品質、自訂位元率
  - Rationale: 品質設定平衡檔案大小和畫質，滿足不同使用場景

## Risks / Trade-offs
- Risk: 大型影片剪輯可能耗時較長 → Mitigation: 顯示進度，考慮後續加入取消功能
- Risk: FFmpeg 操作失敗可能導致部分片段未匯出 → Mitigation: 記錄錯誤，繼續處理其他片段
- Risk: 輸出目錄空間不足 → Mitigation: 在開始前檢查可用空間（可選）
- Risk: 檔案名稱衝突 → Mitigation: 自動添加序號或時間戳

## Migration Plan
不適用（新功能）

## Open Questions
- 是否需要支援匯出前預覽檔案名稱？
  - 決定：先實作基本功能，預覽功能留待後續擴充
- 輸出格式和品質的預設值？
  - 決定：格式預設為原始格式，品質預設為高品質（原始品質）
