import { useVideoStore } from '../../stores/videoStore';

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
      const loadResult = await window.electronAPI.loadVideo();

      if (!loadResult.success || !loadResult.data) {
        setError(loadResult.error || '載入影片失敗');
        setLoading(false);
        return;
      }

      const videoPath = loadResult.data;
      setVideoPath(videoPath);

      // 取得影片資訊
      const infoResult = await window.electronAPI.getVideoInfo(videoPath);

      if (!infoResult.success || !infoResult.data) {
        setError(infoResult.error || '無法取得影片資訊');
        setVideoPath(null);
        setLoading(false);
        return;
      }

      setVideoInfo(infoResult.data);
      setLoading(false);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : '載入影片時發生未知錯誤'
      );
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
