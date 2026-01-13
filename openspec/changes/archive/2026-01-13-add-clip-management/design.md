## Context
需要實作片段管理功能，讓使用者能夠建立、編輯和刪除多個剪輯片段。每個片段包含名稱、開始時間和結束時間。這是後續時間軸視覺化和批次輸出的基礎。

## Goals / Non-Goals
- Goals:
  - 使用者可以新增、編輯、刪除剪輯片段
  - 片段包含名稱、開始時間、結束時間
  - 驗證時間範圍的有效性
  - 確保時間範圍在影片長度內
  - 提供友善的表單介面

- Non-Goals:
  - 不實作片段重疊檢查（留待後續擴充）
  - 不實作片段預覽（留待後續提案）
  - 不實作片段匯出（留待後續提案）
  - 不實作片段拖放排序（留待後續擴充）

## Decisions
- Decision: 使用 Zustand 管理片段狀態
  - Alternatives considered: React Context, Redux
  - Rationale: 與專案其他狀態管理保持一致，輕量級且簡單

- Decision: 片段 ID 使用 UUID 或時間戳
  - Alternatives considered: 自增數字、UUID
  - Rationale: 使用簡單的時間戳 + 隨機數生成唯一 ID，避免依賴額外套件

- Decision: 時間輸入支援多種格式
  - Alternatives considered: 僅支援秒數、僅支援時:分:秒
  - Rationale: 提供更好的使用者體驗，支援秒數、分:秒、時:分:秒多種格式

- Decision: 片段驗證在新增/編輯時進行
  - Alternatives considered: 延遲驗證、批次驗證
  - Rationale: 即時驗證提供更好的使用者體驗，避免無效資料

## Risks / Trade-offs
- Risk: 時間格式解析可能出錯 → Mitigation: 使用已實作的 parseTime 函數，提供明確的錯誤訊息
- Risk: 大量片段可能影響效能 → Mitigation: 目前預期片段數量不會太多，後續可考慮虛擬化列表
- Risk: 片段狀態與影片狀態不同步 → Mitigation: 清除影片時同時清除片段

## Migration Plan
不適用（新功能）

## Open Questions
- 是否需要支援片段匯入/匯出？
  - 決定：先實作基本功能，匯入/匯出留待後續擴充
