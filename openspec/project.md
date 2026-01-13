# Project Context

## Purpose
VedioClip 是一個基於 Electron 的桌面應用程式，用於影片剪輯。主要功能包括：
- 載入影片檔案並顯示影片資訊
- 建立和管理多個剪輯片段（定義開始和結束時間）
- 透過時間軸視覺化顯示片段
- 影片預覽功能
- 批次輸出多個剪輯片段為獨立影片檔案

目標是提供一個簡單易用的工具，讓使用者能夠從單一影片中快速提取多個片段並批次輸出。

## Tech Stack
- **桌面框架**: Electron
- **前端框架**: React + TypeScript
- **建置工具**: Vite + electron-builder
- **影片處理**: FFmpeg (透過 fluent-ffmpeg)
- **狀態管理**: Zustand 或 Jotai
- **UI 框架**: Tailwind CSS
- **UI 元件**: Radix UI 或 Headless UI（無樣式元件，可自訂樣式）

## Project Conventions

### Code Style
- 使用 TypeScript 進行型別檢查
- 元件化開發（React 函數式元件）
- 使用 ESLint 和 Prettier 進行程式碼格式化（建議設定）
- 命名慣例：
  - 元件檔案：PascalCase（如 `VideoPlayer.tsx`）
  - 工具函數：camelCase（如 `formatTime.ts`）
  - 型別定義：PascalCase（如 `VideoInfo`）
  - 常數：UPPER_SNAKE_CASE

### Architecture Patterns
- **Electron 主進程/渲染進程分離**：
  - `src/main/` - Electron 主進程（處理檔案系統、FFmpeg 操作）
  - `src/renderer/` - React 渲染進程（UI 和狀態管理）
  - `src/shared/` - 共享型別定義
- **IPC 通訊**：使用 `contextIsolation: true` 和 `preload` 腳本確保安全性
- **狀態管理**：使用 Zustand 進行輕量級狀態管理
- **模組化設計**：功能按元件劃分（VideoPlayer, Timeline, ClipList, ClipEditor, ExportPanel）

### Testing Strategy
- 測試策略待定義
- 建議包含：
  - 單元測試：工具函數（時間格式化、檔案名稱清理）
  - 整合測試：IPC 通訊、FFmpeg 操作
  - 元件測試：React 元件渲染和互動

### Git Workflow
- Git 工作流程待定義
- 建議使用：
  - 功能分支策略（feature branches）
  - 明確的 commit message 格式
  - PR 審查流程

## Domain Context
- **影片片段（Clip Segment）**：包含名稱、開始時間、結束時間的剪輯單位
- **時間格式**：支援多種輸入格式（秒數、分:秒、時:分:秒），內部統一轉換為秒數
- **批次輸出**：依序處理多個片段，每個片段輸出為獨立檔案
- **FFmpeg 操作**：所有影片處理操作在主進程執行，透過 IPC 與渲染進程通訊
- **進度追蹤**：輸出過程中透過 IPC 事件發送進度更新

## Important Constraints
- **FFmpeg 依賴**：需要系統安裝 FFmpeg 或使用 `@ffmpeg-installer/ffmpeg` 自動下載
- **安全性**：必須使用 `contextIsolation: true`，不允許直接使用 `nodeIntegration`
- **效能考量**：大型影片處理時需避免 UI 凍結，考慮使用 Worker 執行緒
- **檔案格式支援**：主要支援 mp4, avi, mov, mkv 等常見格式
- **時間驗證**：片段時間範圍必須在影片長度內，且開始時間 < 結束時間

## External Dependencies
- **FFmpeg**：核心影片處理引擎，用於：
  - 取得影片資訊（ffprobe）
  - 剪輯影片片段
  - 輸出影片檔案
- **Electron**：桌面應用程式框架
- **fluent-ffmpeg**：Node.js 的 FFmpeg 封裝，提供友善的 API
