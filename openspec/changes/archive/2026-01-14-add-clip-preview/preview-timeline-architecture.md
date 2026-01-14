# 預覽模式時間軸架構設計

## 需求概述
當使用者點擊「預覽」按鈕時，時間軸應該只顯示該片段的範圍（例如 3 秒），而不是整個影片的長度。這讓使用者能夠更精確地查看和操作片段內容。

## 設計目標
1. **時間軸範圍限制**：預覽模式下，進度條只顯示片段範圍（startTime 到 endTime）
2. **進度計算**：進度百分比基於片段範圍，而非整個影片
3. **時間顯示**：清楚顯示當前在片段中的相對位置
4. **互動一致性**：拖動和點擊進度條的行為在預覽模式下仍然直觀

## 架構方案

### 方案 A：相對時間軸（推薦）

#### 核心概念
- **正常模式**：時間軸範圍 = `[0, duration]`，進度 = `currentTime / duration`
- **預覽模式**：時間軸範圍 = `[startTime, endTime]`，進度 = `(currentTime - startTime) / (endTime - startTime)`

#### 實作細節

**1. 時間軸範圍計算**
```typescript
// 計算時間軸的顯示範圍
const getTimelineRange = () => {
  if (currentPreviewSegment) {
    return {
      min: currentPreviewSegment.startTime,
      max: currentPreviewSegment.endTime,
      duration: currentPreviewSegment.endTime - currentPreviewSegment.startTime
    };
  }
  return {
    min: 0,
    max: duration,
    duration: duration
  };
};

const timelineRange = getTimelineRange();
```

**2. 進度百分比計算**
```typescript
// 計算進度百分比（基於當前時間軸範圍）
const getProgressPercentage = () => {
  if (currentPreviewSegment) {
    const segmentDuration = currentPreviewSegment.endTime - currentPreviewSegment.startTime;
    const relativeTime = currentTime - currentPreviewSegment.startTime;
    return Math.max(0, Math.min(100, (relativeTime / segmentDuration) * 100));
  }
  return (currentTime / duration) * 100;
};
```

**3. 時間顯示**
```typescript
// 顯示時間（預覽模式顯示相對時間）
const getDisplayTime = () => {
  if (currentPreviewSegment) {
    const relativeTime = currentTime - currentPreviewSegment.startTime;
    const segmentDuration = currentPreviewSegment.endTime - currentPreviewSegment.startTime;
    return `${formatTime(relativeTime, true)} / ${formatTime(segmentDuration, true)}`;
  }
  return `${formatTime(currentTime, true)} / ${formatTime(duration, true)}`;
};
```

**4. 進度條互動（點擊/拖動）**
```typescript
// 點擊進度條時，將點擊位置轉換為絕對時間
const handleProgressClick = (e: React.MouseEvent) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const percentage = clickX / rect.width;
  
  let targetTime: number;
  if (currentPreviewSegment) {
    // 預覽模式：在片段範圍內計算
    const segmentDuration = currentPreviewSegment.endTime - currentPreviewSegment.startTime;
    targetTime = currentPreviewSegment.startTime + (percentage * segmentDuration);
  } else {
    // 正常模式：在整個影片範圍內計算
    targetTime = percentage * duration;
  }
  
  // 限制在有效範圍內
  targetTime = Math.max(timelineRange.min, Math.min(timelineRange.max, targetTime));
  video.currentTime = targetTime;
};
```

**5. 播放範圍限制（可選）**
```typescript
// 監聽播放進度，到達片段結束時自動停止
useEffect(() => {
  if (!currentPreviewSegment || !isPlaying) return;
  
  const checkEnd = () => {
    if (currentTime >= currentPreviewSegment.endTime) {
      video.pause();
      // 可選：自動跳回片段開始
      // video.currentTime = currentPreviewSegment.startTime;
    }
  };
  
  const interval = setInterval(checkEnd, 100);
  return () => clearInterval(interval);
}, [currentPreviewSegment, currentTime, isPlaying]);
```

#### 優點
- ✅ 直觀：時間軸直接反映片段範圍
- ✅ 精確：更容易在片段範圍內精確操作
- ✅ 視覺清晰：進度條長度直接對應片段長度

#### 缺點
- ⚠️ 需要額外的計算邏輯
- ⚠️ 切換模式時需要重新計算

---

### 方案 B：視覺縮放（不推薦）

#### 核心概念
- 時間軸仍然顯示整個影片範圍（0 到 duration）
- 但用視覺標記（例如不同顏色）標示片段範圍
- 進度條在片段範圍內時顯示為高亮

#### 缺點
- ❌ 不夠直觀，片段範圍可能只佔時間軸的一小部分
- ❌ 在長影片中，片段範圍可能難以精確操作

---

## 推薦方案：方案 A（相對時間軸）

### 實作步驟

1. **修改進度計算邏輯**
   - 新增 `getTimelineRange()` 函數
   - 修改 `getProgressPercentage()` 函數
   - 修改 `getDisplayTime()` 函數

2. **修改進度條互動**
   - 更新 `handleProgressClick` 以支援預覽模式
   - 更新 `handleSeek` 以支援預覽模式
   - 更新 `<input type="range">` 的 `min` 和 `max` 屬性

3. **可選：播放範圍限制**
   - 監聽播放進度，到達片段結束時自動停止
   - 或提供選項讓使用者選擇是否自動停止

4. **視覺優化**
   - 可選：在進度條上標示片段範圍（如果保留整個影片範圍的視覺參考）

### 狀態管理
不需要修改 `videoStore`，現有的 `currentPreviewSegment` 已經足夠。

### 邊界情況處理
- **片段時間超出影片範圍**：限制在 `[0, duration]` 內
- **切換模式時**：保持當前播放位置（如果仍在有效範圍內）
- **片段時長為 0**：顯示錯誤或禁用預覽

---

## 決策點

### 1. 播放到片段結束時的行為
- **選項 A**：自動停止（推薦）
- **選項 B**：自動循環（跳回片段開始）
- **選項 C**：繼續播放（超出片段範圍）

**建議**：選項 A（自動停止），因為這是「預覽片段」，應該只播放片段內容。

### 2. 時間顯示格式
- **選項 A**：只顯示相對時間 `0:03 / 0:10`（片段內 3 秒 / 片段總長 10 秒）
- **選項 B**：顯示絕對時間 + 相對時間 `1:23.45 (0:03 / 0:10)`
- **選項 C**：顯示絕對時間，但標註範圍 `1:23.45 / 1:33.45`

**建議**：選項 A（只顯示相對時間），因為預覽模式下使用者主要關心片段內的相對位置。

### 3. 進度條視覺設計
- **選項 A**：只顯示片段範圍（推薦）
- **選項 B**：顯示整個影片範圍，但用不同顏色標示片段範圍

**建議**：選項 A，更簡潔直觀。

---

## 確認事項

請確認以下設計決策：

1. ✅ **時間軸範圍**：預覽模式下只顯示片段範圍（方案 A）
2. ⚠️ **播放到結束**：自動停止 / 自動循環 / 繼續播放？（建議：自動停止）
3. ⚠️ **時間顯示**：只顯示相對時間 / 顯示絕對+相對時間？（建議：只顯示相對時間）
4. ⚠️ **進度條視覺**：只顯示片段範圍 / 顯示整個影片但標記片段？（建議：只顯示片段範圍）
