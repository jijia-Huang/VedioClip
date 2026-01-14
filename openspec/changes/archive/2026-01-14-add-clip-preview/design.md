## Context
目前的影片播放器（VideoPlayer）是一個相對封閉的元件，其 `currentTime` 和播放狀態主要由內部 `video` 元素和 React state 管理。外部元件（如 ClipList）無法直接控制播放器的行為。

## Decisions
- **使用 Store 進行解耦**：不使用 Ref 透傳或 Event Bus，而是透過 `videoStore` 新增一個「請求」狀態（如 `seekRequest`），這符合專案現有的 Zustand 模式。
- **請求對象設計**：
    ```typescript
    seekRequest: { time: number; timestamp: number } | null
    ```
    使用 `timestamp` 是為了確保即使連續請求跳轉到同一個時間點（例如重複點擊同一個片段的預覽），監聽器也能偵測到狀態變化並觸發跳轉。

- **自動播放行為**：
    預覽片段通常伴隨著播放需求。除了跳轉，也會觸發一個播放請求，讓 `VideoPlayer` 確保處於播放狀態。

- **預覽狀態管理**：
    ```typescript
    currentPreviewSegment: { id: string; name: string; startTime: number; endTime: number } | null
    ```
    儲存當前預覽的片段資訊，用於顯示標題和判斷是否處於預覽模式。當為 `null` 時表示正常播放模式。

- **標題顯示位置**：
    在 `VideoPlayer` 元件的影片元素上方新增一個半透明的標題欄，顯示當前片段名稱或「原影片」。使用 `absolute` 定位，確保不影響影片播放區域的佈局。

- **返回原影片按鈕**：
    放置在播放控制區（與播放/暫停按鈕同一行），只在 `currentPreviewSegment` 不為 `null` 時顯示。點擊時清除預覽狀態，但不重置播放位置，讓使用者可以從當前位置繼續觀看完整影片。

## Risks / Trade-offs
- **競爭狀態**：如果使用者在自動跳轉播放時手動操作播放器，可能會產生衝突。目前的設計以最後一次請求為準。
- **效能**：Zustand 的頻繁更新可能導致不必要的渲染，但由於 `seekRequest` 只在點擊時觸發，頻率極低，不會影響效能。
