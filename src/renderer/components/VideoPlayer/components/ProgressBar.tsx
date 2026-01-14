interface TimelineRange {
  min: number;
  max: number;
  duration: number;
}

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  timelineRange: TimelineRange;
  progressPercentage: number;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSeekStart: () => void;
  onSeekEnd: () => void;
  onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * 進度條組件
 * 顯示播放進度並支持拖動跳轉
 */
export function ProgressBar({
  currentTime,
  timelineRange,
  progressPercentage,
  onSeek,
  onSeekStart,
  onSeekEnd,
  onProgressClick,
}: ProgressBarProps) {
  return (
    <div className="w-full mb-4">
      <div
        className="w-full h-3 bg-gray-700 rounded-full cursor-pointer relative progress-bar-container overflow-hidden"
        onClick={onProgressClick}
      >
        <div
          className="h-full bg-blue-600 rounded-full pointer-events-none absolute left-0 top-0"
          style={{ 
            width: `${Math.max(0, Math.min(100, progressPercentage))}%`,
            transition: 'none'
          }}
        />
        {/* 拖動點（白點） */}
        {timelineRange.duration > 0 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg pointer-events-none z-20"
            style={{ 
              left: `calc(${Math.max(0, Math.min(100, progressPercentage))}% - 8px)`
            }}
          />
        )}
        {timelineRange.duration > 0 && (
          <input
            type="range"
            min={timelineRange.min}
            max={timelineRange.max}
            value={Math.max(timelineRange.min, Math.min(currentTime, timelineRange.max))}
            step={timelineRange.duration > 3600 ? "1" : timelineRange.duration > 60 ? "0.1" : "0.01"}
            onChange={onSeek}
            onMouseDown={onSeekStart}
            onTouchStart={onSeekStart}
            onMouseUp={onSeekEnd}
            onTouchEnd={onSeekEnd}
            onMouseLeave={onSeekEnd}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 custom-range-input"
            style={{ WebkitAppearance: 'none', appearance: 'none' }}
          />
        )}
      </div>
    </div>
  );
}
