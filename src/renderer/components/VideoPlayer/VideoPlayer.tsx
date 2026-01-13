import { useRef, useState, useEffect, useCallback } from 'react';
import { useVideoStore } from '../../stores/videoStore';
import { formatTime } from '../../utils/timeFormat';

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isSeekingRef = useRef(false); // 使用 ref 避免閉包問題
  const rafRef = useRef<number | null>(null); // requestAnimationFrame 引用

  const videoPath = useVideoStore((state) => state.videoPath);

  // 當影片路徑改變時重置播放器
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (videoPath) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setIsLoading(true);
      video.src = videoPath;
      video.load();
      
      // 使用輪詢檢查確保載入狀態正確更新（作為事件監聽器的備用）
      // 這確保即使事件沒有觸發，也能正確更新載入狀態
      let checkCount = 0;
      const maxChecks = 40; // 最多檢查 40 次（2秒）
      const intervalId = setInterval(() => {
        checkCount++;
        const currentVideo = videoRef.current;
        if (!currentVideo) {
          clearInterval(intervalId);
          return;
        }
        
        // 檢查 readyState 或 duration
        const hasDuration = currentVideo.duration && isFinite(currentVideo.duration) && currentVideo.duration > 0;
        const isReady = currentVideo.readyState >= 2; // HAVE_CURRENT_DATA
        
        if (hasDuration || isReady) {
          setIsLoading(false);
          if (hasDuration) {
            setDuration(currentVideo.duration);
          }
          clearInterval(intervalId);
        } else if (checkCount >= maxChecks) {
          // 即使檢查了 maxChecks 次還沒載入，也停止檢查（避免無限循環）
          clearInterval(intervalId);
        }
      }, 50);
      
      return () => {
        clearInterval(intervalId);
      };
    } else {
      video.src = '';
      video.load();
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setIsLoading(false);
    }
  }, [videoPath]);

  // 使用 requestAnimationFrame 高頻率更新時間（只在播放時）
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !duration || duration === 0) {
      // 停止 requestAnimationFrame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    // 只在播放且非拖動狀態下才使用 requestAnimationFrame
    if (!isPlaying || isSeekingRef.current || video.paused) {
      // 停止 requestAnimationFrame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    let lastUpdateTime = 0;
    const updateTime = () => {
      const video = videoRef.current;
      // 檢查 video 元素是否仍然有效
      if (!video || !duration || duration === 0) {
        rafRef.current = null;
        return;
      }

      // 檢查是否仍在播放且非拖動狀態
      if (!video.paused && !isSeekingRef.current) {
        const currentVideoTime = video.currentTime;
        if (currentVideoTime && isFinite(currentVideoTime)) {
          // 只在時間有實際變化時更新（減少不必要的渲染）
          if (Math.abs(currentVideoTime - lastUpdateTime) >= 0.001) {
            setCurrentTime(currentVideoTime);
            lastUpdateTime = currentVideoTime;
          }
        }
        // 繼續更新循環
        rafRef.current = requestAnimationFrame(updateTime);
      } else {
        // 停止更新循環
        rafRef.current = null;
      }
    };

    // 開始更新循環
    rafRef.current = requestAnimationFrame(updateTime);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPlaying, duration]);

  // 統一的載入狀態更新函數
  const updateLoadingState = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      setIsLoading(false);
      return;
    }

    // 如果沒有設定 src，不需要載入
    if (!video.src || video.src === '') {
      setIsLoading(false);
      return;
    }

    // 載入完成的條件：readyState >= HAVE_CURRENT_DATA (2) 或 有 duration
    const hasDuration = video.duration && isFinite(video.duration) && video.duration > 0;
    const isReady = video.readyState >= 2; // HAVE_CURRENT_DATA 或更高
    
    // 如果已經有 duration 或 readyState >= 2，就認為載入完成
    if (hasDuration || isReady) {
      setIsLoading(false);
    }
  }, []);

  // 處理影片事件監聽（組件掛載時註冊，確保能捕獲所有事件）
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // 只在暫停時使用 timeupdate 更新（播放時由 requestAnimationFrame 處理）
      if (video.paused && !isSeekingRef.current && video.currentTime && isFinite(video.currentTime)) {
        setCurrentTime(video.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (video.duration && isFinite(video.duration)) {
        setDuration(video.duration);
      }
      // loadedmetadata 事件表示 metadata 已載入，可以顯示了
      setIsLoading(false);
    };

    const handleLoadedData = () => {
      if (video.duration && isFinite(video.duration)) {
        setDuration(video.duration);
      }
      // loadeddata 事件表示數據已載入，可以顯示了
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      if (video.duration && isFinite(video.duration)) {
        setDuration(video.duration);
      }
      // canplay 事件表示可以播放，肯定載入完成了
      setIsLoading(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (video) {
        video.currentTime = 0;
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setDuration(0);
      setCurrentTime(0);
    };

    const handleDurationChange = () => {
      if (video.duration && isFinite(video.duration) && video.duration > 0) {
        setDuration(video.duration);
        // durationchange 且 duration > 0 表示載入完成
        setIsLoading(false);
      }
    };

    // 註冊事件監聽器
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('durationchange', handleDurationChange);

    // 初始狀態檢查（延遲一點確保 video 元素已準備好）
    const timer = setTimeout(() => {
      updateLoadingState();
    }, 50);

    return () => {
      clearTimeout(timer);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('durationchange', handleDurationChange);
    };
  }, [updateLoadingState, videoPath]);

  // 當 duration 改變時，更新載入狀態
  useEffect(() => {
    updateLoadingState();
  }, [duration, updateLoadingState]);

  // 播放/暫停處理
  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((error) => {
        console.error('播放失敗:', error);
      });
    }
  }, [isPlaying]);

  // 拖動開始
  const handleSeekStart = useCallback(() => {
    isSeekingRef.current = true;
    const video = videoRef.current;
    if (video && isPlaying) {
      video.pause();
    }
  }, [isPlaying]);

  // 拖動中
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || !duration || duration === 0) return;

    const rawTime = parseFloat(e.target.value);
    if (!isFinite(rawTime)) return;

    // 限制時間範圍在 0 到 duration 之間
    const newTime = Math.max(0, Math.min(rawTime, duration));
    
    // 立即更新顯示
    setCurrentTime(newTime);
    // 設置 video 時間
    video.currentTime = newTime;
  }, [duration]);

  // 拖動結束
  const handleSeekEnd = useCallback(() => {
    isSeekingRef.current = false;
  }, []);

  // 點擊進度條跳轉
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isSeekingRef.current) return;

    const video = videoRef.current;
    if (!video || !duration || duration === 0) return;

    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT') return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const rawTime = percentage * duration;
    
    // 限制時間範圍在 0 到 duration 之間
    const newTime = Math.max(0, Math.min(rawTime, duration));

    if (isFinite(newTime)) {
      isSeekingRef.current = true;
      if (isPlaying) {
        video.pause();
      }
      video.currentTime = newTime;
      setCurrentTime(newTime);
      isSeekingRef.current = false;
    }
  }, [duration, isPlaying]);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!videoPath) {
    return (
      <div className="bg-gray-800 rounded-lg h-full flex items-center justify-center text-gray-400 border border-gray-700">
        <p>請先載入影片</p>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg overflow-hidden h-full flex flex-col">
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
        <div className="w-full mb-4">
          <div
            className="w-full h-3 bg-gray-700 rounded-full cursor-pointer relative progress-bar-container overflow-hidden"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-blue-600 rounded-full pointer-events-none absolute left-0 top-0"
              style={{ 
                width: `${Math.max(0, Math.min(100, progressPercentage))}%`,
                transition: 'none'
              }}
            />
            {/* 拖動點（白點） */}
            {duration > 0 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg pointer-events-none z-20"
                style={{ 
                  left: `calc(${Math.max(0, Math.min(100, progressPercentage))}% - 8px)`
                }}
              />
            )}
            {duration > 0 && (
              <input
                type="range"
                min="0"
                max={duration}
                value={Math.max(0, Math.min(currentTime, duration))}
                step={duration > 3600 ? "1" : duration > 60 ? "0.1" : "0.01"}
                onChange={handleSeek}
                onMouseDown={handleSeekStart}
                onTouchStart={handleSeekStart}
                onMouseUp={handleSeekEnd}
                onTouchEnd={handleSeekEnd}
                onMouseLeave={handleSeekEnd}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 custom-range-input"
                style={{ WebkitAppearance: 'none', appearance: 'none' }}
              />
            )}
          </div>
        </div>

        {/* 控制按鈕和時間 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              disabled={isLoading || !duration || duration === 0}
              className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-sm"
            >
              {isLoading ? '載入中...' : isPlaying ? '⏸' : '▶'}
            </button>

            <div className="text-white text-xs font-mono">
              {formatTime(currentTime, true)} / {formatTime(duration, true)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
