## Context
VedioClip 是一個桌面影片剪輯工具，需要建立 Electron 應用程式的基礎架構。根據技術方案，專案採用 Electron + React + TypeScript 技術棧，使用 Vite 作為建置工具，electron-builder 作為打包工具。

## Goals / Non-Goals
- Goals:
  - 建立清晰的專案結構，分離主進程和渲染進程
  - 設定安全的 IPC 通訊機制（contextIsolation）
  - 配置現代化的開發工具鏈（Vite + TypeScript）
  - 建立可擴展的架構基礎，支援後續功能開發

- Non-Goals:
  - 不實作具體的業務功能（影片載入、剪輯等）
  - 不設定測試框架（留待後續提案）
  - 不設定 CI/CD（留待後續提案）

## Decisions
- Decision: 使用 Vite 作為建置工具
  - Alternatives considered: Webpack, esbuild
  - Rationale: Vite 提供快速的開發體驗和簡單的配置，適合 Electron 應用程式

- Decision: 使用 contextIsolation 和 preload 腳本
  - Alternatives considered: nodeIntegration: true
  - Rationale: 安全性最佳實踐，防止渲染進程直接存取 Node.js API

- Decision: 使用 Zustand 作為狀態管理
  - Alternatives considered: Redux, Jotai, Recoil
  - Rationale: 輕量級、簡單易用，適合 Electron 應用程式

- Decision: 專案結構採用 main/renderer/shared 分離
  - Alternatives considered: 單一目錄結構
  - Rationale: 清晰的職責分離，符合 Electron 架構模式

## Risks / Trade-offs
- Risk: FFmpeg 路徑配置複雜 → Mitigation: 使用 @ffmpeg-installer/ffmpeg 自動處理
- Risk: Vite 與 Electron 整合可能有相容性問題 → Mitigation: 參考成熟的 Electron + Vite 模板
- Risk: TypeScript 配置可能過於複雜 → Mitigation: 採用簡潔的配置，逐步擴展

## Migration Plan
不適用（新專案初始化）

## Open Questions
- FFmpeg 是否需要在初始化階段就完全整合，還是可以先建立基礎架構？
  - 決定：先建立基礎架構，FFmpeg 整合留待後續功能開發時實作
