import { useVideoStore } from '../../stores/videoStore';
import { formatTime, formatBitrate } from '../../utils/timeFormat';

export function VideoInfoDisplay() {
  const videoPath = useVideoStore((state) => state.videoPath);
  const videoInfo = useVideoStore((state) => state.videoInfo);

  if (!videoPath || !videoInfo) {
    return null;
  }

  // 取得檔案名稱
  const fileName = videoPath.split(/[/\\]/).pop() || videoPath;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">影片資訊</h2>
      <div className="space-y-3">
        <div>
          <span className="font-semibold text-gray-700">檔案名稱：</span>
          <span className="text-gray-600 ml-2">{fileName}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">時長：</span>
          <span className="text-gray-600 ml-2">{formatTime(videoInfo.duration)}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">解析度：</span>
          <span className="text-gray-600 ml-2">
            {videoInfo.width} x {videoInfo.height}
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">格式：</span>
          <span className="text-gray-600 ml-2">{videoInfo.format}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-700">位元率：</span>
          <span className="text-gray-600 ml-2">
            {formatBitrate(videoInfo.bitrate)}
          </span>
        </div>
      </div>
    </div>
  );
}
