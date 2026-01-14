import { useRef } from 'react';
import { useVideoStore } from '../../stores/videoStore';
import { useVideoPlayback, useVideoSeek } from './hooks';
import { VideoControls, ProgressBar } from './components';

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoPath = useVideoStore((state) => state.videoPath);
  const currentPreviewSegment = useVideoStore((state) => state.currentPreviewSegment);
  const clearPreview = useVideoStore((state) => state.clearPreview);
  const loop = useVideoStore((state) => state.loop);
  const toggleLoop = useVideoStore((state) => state.toggleLoop);

  // 使用播放控制 Hook
  const {
    isPlaying,
    currentTime,
    setCurrentTime,
    duration,
    isLoading,
    handlePlayPause,
  } = useVideoPlayback(videoRef);

  // 使用跳轉控制 Hook
  const {
    handleSeekStart,
    handleSeek,
    handleSeekEnd,
    handleProgressClick,
    getTimelineRange,
    getProgressPercentage,
  } = useVideoSeek(videoRef, duration);

  // 處理返回原影片
  const handleBackToOriginal = () => {
    clearPreview();
  };

  // 計算時間軸範圍和進度百分比
  const timelineRange = getTimelineRange();
  const progressPercentage = getProgressPercentage(currentTime);

  // 包裝 seek 處理函數以傳遞 setCurrentTime
  const handleSeekWithTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSeek(e, setCurrentTime);
  };

  // 包裝進度條點擊處理函數
  const handleProgressClickWithTime = (e: React.MouseEvent<HTMLDivElement>) => {
    handleProgressClick(e, isPlaying, setCurrentTime);
  };

  if (!videoPath) {
    return (
      <div className="bg-gray-800 rounded-lg h-full flex items-center justify-center text-gray-400 border border-gray-700">
        <p>請先載入影片</p>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg overflow-hidden h-full flex flex-col relative">
      {/* 標題區域 */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-60 px-4 py-2">
        <div className="text-white text-sm font-medium">
          {currentPreviewSegment ? currentPreviewSegment.name : '原影片'}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-0">
        <video
          ref={videoRef}
          src={videoPath}
          className="w-full h-full object-contain"
        />
      </div>

      {/* 播放控制區 */}
      <div className="bg-gray-900 p-3 flex-shrink-0">
        {/* 進度條 */}
        <ProgressBar
          currentTime={currentTime}
          timelineRange={timelineRange}
          progressPercentage={progressPercentage}
          onSeek={handleSeekWithTime}
          onSeekStart={handleSeekStart}
          onSeekEnd={handleSeekEnd}
          onProgressClick={handleProgressClickWithTime}
        />

        {/* 控制按鈕和時間 */}
        <VideoControls
          isPlaying={isPlaying}
          isLoading={isLoading}
          hasDuration={duration > 0}
          currentTime={currentTime}
          duration={duration}
          currentPreviewSegment={currentPreviewSegment}
          loop={loop}
          onPlayPause={handlePlayPause}
          onToggleLoop={toggleLoop}
          onBackToOriginal={handleBackToOriginal}
        />
      </div>
    </div>
  );
}
