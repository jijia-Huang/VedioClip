import { formatTime } from '../../../utils/timeFormat';

interface VideoControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  hasDuration: boolean;
  currentTime: number;
  duration: number;
  currentPreviewSegment: { startTime: number; endTime: number } | null;
  loop: boolean;
  onPlayPause: () => void;
  onToggleLoop: () => void;
  onBackToOriginal?: () => void;
}

/**
 * 影片控制按鈕組件
 * 包含播放/暫停、循環播放按鈕
 */
export function VideoControls({
  isPlaying,
  isLoading,
  hasDuration,
  currentTime,
  duration,
  currentPreviewSegment,
  loop,
  onPlayPause,
  onToggleLoop,
  onBackToOriginal,
}: VideoControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onPlayPause}
          disabled={isLoading || !hasDuration}
          className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-sm"
        >
          {isLoading ? '載入中...' : isPlaying ? '⏸' : '▶'}
        </button>

        <button
          onClick={onToggleLoop}
          className={`px-3 py-1.5 rounded transition-colors text-sm ${
            loop
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          title={loop ? '關閉循環播放' : '開啟循環播放'}
        >
          🔄
        </button>

        <div className="text-white text-xs font-mono">
          {currentPreviewSegment ? (
            <>
              {formatTime(Math.max(0, currentTime - currentPreviewSegment.startTime), true)} / {formatTime(currentPreviewSegment.endTime - currentPreviewSegment.startTime, true)}
            </>
          ) : (
            <>
              {formatTime(currentTime, true)} / {formatTime(duration, true)}
            </>
          )}
        </div>
      </div>

      {/* 返回原影片按鈕（只在預覽模式下顯示） */}
      {currentPreviewSegment && onBackToOriginal && (
        <button
          onClick={onBackToOriginal}
          className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors text-sm"
        >
          返回原影片
        </button>
      )}
    </div>
  );
}
