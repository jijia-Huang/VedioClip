import { useVideoStore } from '../../stores/videoStore';
import { videoService, VideoLoadError, VideoInfoError } from '../../services';

export function VideoLoader() {
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
    <div className="mb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={handleLoadVideo}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '載入中...' : '載入影片'}
        </button>
        {videoPath && (
          <button
            onClick={clearVideo}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            清除
          </button>
        )}
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
