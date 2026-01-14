import { useVideoStore } from '../../stores/videoStore';
import { useClipStore } from '../../stores/clipStore';

export function StatusBar() {
  const videoPath = useVideoStore((state) => state.videoPath);
  const loading = useVideoStore((state) => state.loading);
  const segments = useClipStore((state) => state.segments);

  const getStatus = (): string => {
    if (loading) return '載入中...';
    if (!videoPath) return '就緒';
    if (segments.length === 0) return `已載入影片，共 ${segments.length} 個片段`;
    return `已載入影片，共 ${segments.length} 個片段`;
  };

  return (
    <footer className="bg-gray-800 text-gray-300 px-6 py-2 text-sm border-t border-gray-700">
      <div className="flex items-center justify-between">
        <span>狀態: {getStatus()}</span>
        <span className="text-gray-400">VedioClip v{__APP_VERSION__}</span>
      </div>
    </footer>
  );
}
