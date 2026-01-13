## ADDED Requirements

### Requirement: 專案目錄結構
專案 SHALL 採用清晰的目錄結構，分離 Electron 主進程、渲染進程和共享程式碼。

#### Scenario: 專案結構符合規範
- **WHEN** 檢視專案根目錄
- **THEN** 存在 `src/main/`、`src/renderer/`、`src/shared/` 目錄
- **AND** 主進程程式碼位於 `src/main/`
- **AND** 渲染進程程式碼位於 `src/renderer/`
- **AND** 共享型別定義位於 `src/shared/`

### Requirement: 依賴管理
專案 SHALL 使用 package.json 管理所有依賴，並包含必要的核心套件。

#### Scenario: 核心依賴已安裝
- **WHEN** 執行 `npm install`
- **THEN** Electron、React、TypeScript 等核心依賴已安裝
- **AND** FFmpeg 相關套件（fluent-ffmpeg）已安裝
- **AND** 狀態管理套件（zustand）已安裝
- **AND** UI 框架（tailwindcss）已安裝

#### Scenario: 開發腳本可用
- **WHEN** 檢視 package.json 的 scripts 區段
- **THEN** 存在 `dev` 腳本用於啟動開發模式
- **AND** 存在 `build` 腳本用於建置應用程式
- **AND** 存在 `package` 腳本用於打包應用程式

### Requirement: TypeScript 配置
專案 SHALL 使用 TypeScript 並提供適當的型別檢查配置。

#### Scenario: TypeScript 配置存在
- **WHEN** 檢視專案根目錄
- **THEN** 存在 `tsconfig.json` 檔案
- **AND** 配置支援 ES2020 或更新版本
- **AND** 配置啟用嚴格的型別檢查

### Requirement: 建置工具配置
專案 SHALL 使用 Vite 作為建置工具，並配置 Electron 主進程和渲染進程的建置目標。

#### Scenario: Vite 配置正確
- **WHEN** 檢視專案根目錄
- **THEN** 存在 `vite.config.ts` 檔案
- **AND** 配置包含主進程和渲染進程的建置設定
- **AND** 執行 `npm run build` 可以成功建置應用程式

### Requirement: Electron 主進程基礎
專案 SHALL 包含基本的 Electron 主進程入口檔案，能夠建立應用程式視窗。

#### Scenario: 主進程可以啟動
- **WHEN** 執行 `npm run dev`
- **THEN** Electron 應用程式視窗成功開啟
- **AND** 視窗載入渲染進程的 HTML 內容
- **AND** 使用 `contextIsolation: true` 和 preload 腳本

#### Scenario: 應用程式生命週期處理
- **WHEN** 關閉應用程式視窗
- **THEN** 應用程式正確處理視窗關閉事件
- **AND** 在所有視窗關閉時正確退出應用程式

### Requirement: IPC 通訊基礎架構
專案 SHALL 提供安全的 IPC 通訊機制，使用 contextBridge 暴露 API。

#### Scenario: Preload 腳本存在
- **WHEN** 檢視 `src/main/` 目錄
- **THEN** 存在 `preload.ts` 檔案
- **AND** 使用 `contextBridge.exposeInMainWorld` 暴露 API
- **AND** 不直接暴露 Node.js API 給渲染進程

#### Scenario: IPC 處理器基礎結構
- **WHEN** 檢視 `src/main/` 目錄
- **THEN** 存在 `ipc-handlers.ts` 檔案
- **AND** 提供 IPC 處理器的基礎結構，供後續功能擴展

### Requirement: React 渲染進程基礎
專案 SHALL 包含基本的 React 應用程式結構，能夠在 Electron 視窗中渲染。

#### Scenario: React 應用程式可以渲染
- **WHEN** 執行 `npm run dev`
- **THEN** React 應用程式成功渲染在 Electron 視窗中
- **AND** 存在 `src/renderer/index.html` 作為入口 HTML
- **AND** 存在 `src/renderer/main.tsx` 作為 React 入口
- **AND** 存在 `src/renderer/App.tsx` 作為根元件

### Requirement: 共享型別定義
專案 SHALL 提供共享的 TypeScript 型別定義，供主進程和渲染進程使用。

#### Scenario: 共享型別定義存在
- **WHEN** 檢視 `src/shared/` 目錄
- **THEN** 存在 `types.ts` 檔案
- **AND** 定義基本的 IPC 通訊型別
- **AND** 主進程和渲染進程都可以匯入這些型別

### Requirement: 打包配置
專案 SHALL 使用 electron-builder 進行應用程式打包，並提供基本配置。

#### Scenario: 打包配置存在
- **WHEN** 檢視專案根目錄
- **THEN** 存在 electron-builder 配置檔案（electron-builder.json 或 package.json 中的 build 區段）
- **AND** 配置包含應用程式基本資訊（名稱、版本）
- **AND** 執行 `npm run package` 可以成功打包應用程式
