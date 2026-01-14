import { useState, useEffect, useRef, useCallback } from 'react';
import { useVideoStore } from '../../../stores/videoStore';

/**
 * 影片播放控制 Hook
 * 處理播放/暫停、時間更新邏輯
 */
export function useVideoPlayback(videoRef: React.RefObject<HTMLVideoElement>) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const rafRef = useRef<number | null>(null);

  const videoPath = useVideoStore((state) => state.videoPath);
  const playRequest = useVideoStore((state) => state.playRequest);
  const currentPreviewSegment = useVideoStore((state) => state.currentPreviewSegment);
  const loop = useVideoStore((state) => state.loop);

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
      
      // 使用輪詢檢查確保載入狀態正確更新
      let checkCount = 0;
      const maxChecks = 40;
      const intervalId = setInterval(() => {
        checkCount++;
        const currentVideo = videoRef.current;
        if (!currentVideo) {
          clearInterval(intervalId);
          return;
        }
        
        const hasDuration = currentVideo.duration && isFinite(currentVideo.duration) && currentVideo.duration > 0;
        const isReady = currentVideo.readyState >= 2;
        
        if (hasDuration || isReady) {
          setIsLoading(false);
          if (hasDuration) {
            setDuration(currentVideo.duration);
          }
          clearInterval(intervalId);
        } else if (checkCount >= maxChecks) {
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
  }, [videoPath, videoRef]);

  // 使用 requestAnimationFrame 高頻率更新時間（只在播放時）
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !duration || duration === 0) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    if (!isPlaying || video.paused) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    let lastUpdateTime = 0;
    const updateTime = () => {
      const video = videoRef.current;
      if (!video || !duration || duration === 0) {
        rafRef.current = null;
        return;
      }

      if (!video.paused) {
        const currentVideoTime = video.currentTime;
        
        // 預覽模式範圍限制：檢查是否超過片段結束時間
        if (currentPreviewSegment && currentVideoTime >= currentPreviewSegment.endTime) {
          if (loop) {
            // 循環模式：跳轉到片段開始並繼續播放
            video.currentTime = currentPreviewSegment.startTime;
            setCurrentTime(currentPreviewSegment.startTime);
            rafRef.current = requestAnimationFrame(updateTime);
            return;
          } else {
            // 非循環模式：停止播放
            video.pause();
            video.currentTime = currentPreviewSegment.endTime;
            setCurrentTime(currentPreviewSegment.endTime);
            rafRef.current = null;
            return;
          }
        }
        
        if (currentVideoTime && isFinite(currentVideoTime)) {
          if (Math.abs(currentVideoTime - lastUpdateTime) >= 0.001) {
            setCurrentTime(currentVideoTime);
            lastUpdateTime = currentVideoTime;
          }
        }
        rafRef.current = requestAnimationFrame(updateTime);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(updateTime);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPlaying, duration, currentPreviewSegment, loop, videoRef]);

  // 統一的載入狀態更新函數
  const updateLoadingState = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      setIsLoading(false);
      return;
    }

    if (!video.src || video.src === '') {
      setIsLoading(false);
      return;
    }

    const hasDuration = video.duration && isFinite(video.duration) && video.duration > 0;
    const isReady = video.readyState >= 2;
    
    if (hasDuration || isReady) {
      setIsLoading(false);
    }
  }, [videoRef]);

  // 處理影片事件監聽
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.paused && video.currentTime && isFinite(video.currentTime)) {
        setCurrentTime(video.currentTime);
      }
      
      // 預覽模式範圍限制
      if (currentPreviewSegment && !video.paused) {
        if (video.currentTime >= currentPreviewSegment.endTime) {
          if (loop) {
            video.currentTime = currentPreviewSegment.startTime;
            setCurrentTime(currentPreviewSegment.startTime);
          } else {
            video.pause();
            video.currentTime = currentPreviewSegment.endTime;
          }
        }
      }
    };

    const handleLoadedMetadata = () => {
      if (video.duration && isFinite(video.duration)) {
        setDuration(video.duration);
      }
      setIsLoading(false);
    };

    const handleLoadedData = () => {
      if (video.duration && isFinite(video.duration)) {
        setDuration(video.duration);
      }
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      if (video.duration && isFinite(video.duration)) {
        setDuration(video.duration);
      }
      setIsLoading(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      if (loop) {
        if (currentPreviewSegment) {
          video.currentTime = currentPreviewSegment.startTime;
          setCurrentTime(currentPreviewSegment.startTime);
        } else {
          video.currentTime = 0;
          setCurrentTime(0);
        }
        video.play().catch((error) => {
          console.error('循環播放失敗:', error);
        });
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
        if (video) {
          video.currentTime = 0;
        }
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
        setIsLoading(false);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('durationchange', handleDurationChange);

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
  }, [updateLoadingState, videoPath, currentPreviewSegment, loop, videoRef]);

  // 當 duration 改變時，更新載入狀態
  useEffect(() => {
    updateLoadingState();
  }, [duration, updateLoadingState]);

  // 監聽播放請求
  useEffect(() => {
    if (!playRequest) return;
    
    const video = videoRef.current;
    if (!video || !videoPath) return;

    if (video.paused) {
      video.play().catch((error) => {
        console.error('播放失敗:', error);
      });
    }
  }, [playRequest, videoPath, videoRef]);

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
  }, [isPlaying, videoRef]);

  return {
    isPlaying,
    currentTime,
    setCurrentTime,
    duration,
    isLoading,
    handlePlayPause,
  };
}
