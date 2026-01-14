/**
 * 路徑工具函數
 * 處理檔案路徑與 URL 之間的轉換
 */

/**
 * 將 file:// URL 轉換為檔案路徑
 * @param fileUrl file:// URL 字串
 * @returns 檔案路徑
 */
export function fileUrlToPath(fileUrl: string): string {
  const urlObj = new URL(fileUrl);
  
  if (process.platform === 'win32') {
    // Windows: file:///C:/path/to/file -> C:/path/to/file
    return decodeURIComponent(urlObj.pathname.substring(1));
  } else {
    // Unix: file:///path/to/file -> /path/to/file
    return decodeURIComponent(urlObj.pathname);
  }
}
