/**
 * 時間格式化工具
 */

/**
 * 將秒數轉換為 時:分:秒 格式
 * @param seconds 秒數
 * @param showMilliseconds 是否顯示毫秒（預設 false）
 * @returns 格式化後的時間字串
 */
export function formatTime(seconds: number, showMilliseconds: boolean = false): string {
  if (!isFinite(seconds) || seconds < 0) {
    seconds = 0;
  }
  
  const totalSeconds = Math.floor(seconds);
  const fractionalPart = seconds - totalSeconds;
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (showMilliseconds) {
    // 顯示到 0.01 秒（兩位小數）
    const ms = Math.floor(fractionalPart * 100);
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
    }
    // 如果小於一分鐘，只顯示秒和毫秒
    if (totalSeconds < 60) {
      return `${secs}.${String(ms).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  }

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

/**
 * 解析時間字串為秒數
 * 支援格式: "10", "1:10", "1:10:30"
 * @param timeString 時間字串
 * @returns 秒數
 * @throws 當格式無效時拋出錯誤
 */
export function parseTime(timeString: string): number {
  const parts = timeString.split(':').map(Number);

  if (parts.length === 1) {
    return parts[0];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  throw new Error('無效的時間格式');
}

/**
 * 格式化位元率
 * @param bitrate 位元率（bps）
 * @returns 格式化後的位元率字串
 */
export function formatBitrate(bitrate: number): string {
  if (bitrate === 0) return '未知';
  if (bitrate < 1000) return `${bitrate} bps`;
  if (bitrate < 1000000) return `${(bitrate / 1000).toFixed(2)} kbps`;
  return `${(bitrate / 1000000).toFixed(2)} Mbps`;
}
