## Why
專案目前只有技術方案文件，尚未建立實際的程式碼結構和建置系統。需要建立完整的 Electron + React + TypeScript 專案基礎架構，包括專案結構、建置工具設定、依賴管理，以及基本的開發環境配置，為後續功能開發奠定基礎。

## What Changes
- 建立專案目錄結構（src/main, src/renderer, src/shared）
- 初始化 package.json 並安裝核心依賴（Electron, React, TypeScript, FFmpeg 相關套件）
- 設定 TypeScript 配置（tsconfig.json）
- 設定 Vite 建置工具配置
- 設定 electron-builder 打包配置
- 建立基本的 Electron 主進程入口檔案
- 建立基本的 React 渲染進程入口檔案
- 設定 IPC 通訊基礎架構（preload 腳本）
- 配置開發環境腳本（dev, build, package）

## Impact
- Affected specs: 新增 `project-foundation` capability
- Affected code: 建立全新的專案結構和配置檔案
- 為後續所有功能開發提供基礎架構
