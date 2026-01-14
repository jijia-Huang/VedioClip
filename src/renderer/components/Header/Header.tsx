import { useVideoStore } from '../../stores/videoStore';
import { videoService, VideoLoadError, VideoInfoError } from '../../services';

export function Header() {
  const {
    videoPath,
    loading,
    error,
    setVideoPath,
    setVideoInfo,
    setLoading,
    setError,
    clearVideo,
  } = useVideoStore();

  const handleLoadVideo = async () => {
    try {
      setLoading(true);
      setError(null);

      // 載入影片檔案
      const videoPath = await videoService.loadVideo();
      setVideoPath(videoPath);

      // 取得影片資訊
      const videoInfo = await videoService.getVideoInfo(videoPath);
      setVideoInfo(videoInfo);
      setLoading(false);
    } catch (error) {
      if (error instanceof VideoLoadError || error instanceof VideoInfoError) {
        setError(error.message);
        // 如果是載入失敗，清除已設定的路徑
        if (error instanceof VideoLoadError) {
          setVideoPath(null);
        } else {
          // 如果是資訊獲取失敗，清除路徑
          setVideoPath(null);
        }
      } else {
        setError(
          error instanceof Error ? error.message : '載入影片時發生未知錯誤'
        );
        setVideoPath(null);
      }
      setLoading(false);
    }
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo/標題 */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-100">VedioClip</h1>
          <span className="text-sm text-gray-400">桌面影片剪輯工具</span>
        </div>

        {/* 右側按鈕 */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLoadVideo}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '載入中...' : '載入影片'}
          </button>
          {videoPath && (
            <button
              onClick={clearVideo}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
            >
              清除
            </button>
          )}
          {/* 設定和幫助按鈕（預留） */}
          <button
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors opacity-50 cursor-not-allowed"
            disabled
            title="功能開發中"
          >
            設定
          </button>
          <button
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors opacity-50 cursor-not-allowed"
            disabled
            title="功能開發中"
          >
            ?
          </button>
        </div>
      </div>
      {error && (
        <div className="mt-3 p-2 bg-red-900 border border-red-700 text-red-200 rounded text-sm">
          {error}
        </div>
      )}
    </header>
  );
}
