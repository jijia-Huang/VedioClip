import { useVideoStore } from '../../stores/videoStore';

// 擴展 Window 介面以包含 electronAPI
declare global {
  interface Window {
    electronAPI: {
      loadVideo: () => Promise<{
        success: boolean;
        data?: string;
        error?: string;
      }>;
      getVideoInfo: (path: string) => Promise<{
        success: boolean;
        data?: {
          duration: number;
          width: number;
          height: number;
          format: string;
          bitrate: number;
        };
        error?: string;
      }>;
      selectExportDir: () => Promise<{ success: boolean; data?: string; error?: string }>;
      exportClips: (
        videoUrl: string,
        segments: any[],
        settings: any
      ) => Promise<{ success: boolean; data?: any; error?: string }>;
      onExportProgress: (callback: (progress: any) => void) => void;
      removeExportProgressListener: () => void;
    };
  }
}

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
