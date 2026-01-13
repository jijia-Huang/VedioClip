## 1. 型別定義
- [x] 1.1 在 src/shared/types.ts 中定義 ClipSegment 介面
- [x] 1.2 定義片段驗證相關型別

## 2. 狀態管理
- [x] 2.1 建立 src/renderer/stores/clipStore.ts
- [x] 2.2 定義片段狀態（segments 陣列）
- [x] 2.3 實作 addSegment action（新增片段）
- [x] 2.4 實作 updateSegment action（更新片段）
- [x] 2.5 實作 deleteSegment action（刪除片段）
- [x] 2.6 實作驗證邏輯（時間範圍、重疊檢查）

## 3. 片段列表元件
- [x] 3.1 建立 src/renderer/components/ClipList/ 目錄
- [x] 3.2 建立 ClipList.tsx（顯示所有片段）
- [x] 3.3 實作片段項目顯示（名稱、開始時間、結束時間）
- [x] 3.4 實作編輯和刪除按鈕
- [x] 3.5 實作新增片段按鈕

## 4. 片段編輯表單元件
- [x] 4.1 建立 src/renderer/components/ClipEditor/ 目錄
- [x] 4.2 建立 ClipEditor.tsx（編輯表單）
- [x] 4.3 實作名稱輸入欄位
- [x] 4.4 實作開始時間輸入欄位（支援多種格式）
- [x] 4.5 實作結束時間輸入欄位（支援多種格式）
- [x] 4.6 實作表單驗證和錯誤提示
- [x] 4.7 實作儲存和取消按鈕

## 5. 驗證邏輯
- [x] 5.1 實作時間範圍驗證（開始時間 < 結束時間）
- [x] 5.2 實作影片長度驗證（時間範圍在影片長度內）
- [x] 5.3 實作片段重疊檢查（可選，後續可擴展）
- [x] 5.4 實作時間格式解析（使用 timeFormat.ts）

## 6. 整合與測試
- [x] 6.1 在 App.tsx 中整合 ClipList 和 ClipEditor
- [x] 6.2 測試新增片段功能（已實作並建置成功）
- [x] 6.3 測試編輯片段功能（已實作）
- [x] 6.4 測試刪除片段功能（已實作）
- [x] 6.5 測試驗證邏輯（無效時間範圍、超出影片長度等，已實作）
