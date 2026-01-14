import { useRef, useCallback, useEffect } from 'react';
import { useVideoStore } from '../../../stores/videoStore';

interface TimelineRange {
  min: number;
  max: number;
  duration: number;
}

/**
 * 影片跳轉控制 Hook
 * 處理拖動、跳轉邏輯
 */
export function useVideoSeek(
  videoRef: React.RefObject<HTMLVideoElement>,
  duration: number
) {
  const isSeekingRef = useRef(false);
  const seekRequest = useVideoStore((state) => state.seekRequest);
  const currentPreviewSegment = useVideoStore((state) => state.currentPreviewSegment);

  // 計算時間軸範圍（正常模式或預覽模式）
  const getTimelineRange = useCallback((): TimelineRange => {
    if (currentPreviewSegment && duration > 0) {
      const startTime = Math.max(0, Math.min(currentPreviewSegment.startTime, duration));
      const endTime = Math.max(startTime, Math.min(currentPreviewSegment.endTime, duration));
      return {
        min: startTime,
        max: endTime,
        duration: endTime - startTime
      };
    }
    return {
      min: 0,
      max: duration,
      duration: duration
    };
  }, [currentPreviewSegment, duration]);

  // 監聽跳轉請求
  useEffect(() => {
    if (!seekRequest) return;
    
    const video = videoRef.current;
    if (!video || !duration || duration === 0) return;

    const targetTime = Math.max(0, Math.min(seekRequest.time, duration));
    isSeekingRef.current = true;
    
    video.currentTime = targetTime;
    
    const timeoutId = setTimeout(() => {
      isSeekingRef.current = false;
    }, 200);
    
    const handleSeeked = () => {
      clearTimeout(timeoutId);
    };
    
    video.addEventListener('seeked', handleSeeked, { once: true });
    
    return () => {
      clearTimeout(timeoutId);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [seekRequest, duration, videoRef]);

  // 拖動開始
  const handleSeekStart = useCallback(() => {
    isSeekingRef.current = true;
    const video = videoRef.current;
    if (video && !video.paused) {
      video.pause();
    }
  }, [videoRef]);

  // 拖動中
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>, setCurrentTime: (time: number) => void) => {
    const video = videoRef.current;
    if (!video || !duration || duration === 0) return;

    const rawTime = parseFloat(e.target.value);
    if (!isFinite(rawTime)) return;

    const timelineRange = getTimelineRange();
    const newTime = Math.max(timelineRange.min, Math.min(rawTime, timelineRange.max));
    
    setCurrentTime(newTime);
    video.currentTime = newTime;
  }, [duration, getTimelineRange, videoRef]);

  // 拖動結束
  const handleSeekEnd = useCallback(() => {
    isSeekingRef.current = false;
  }, []);

  // 點擊進度條跳轉
  const handleProgressClick = useCallback((
    e: React.MouseEvent<HTMLDivElement>,
    isPlaying: boolean,
    setCurrentTime: (time: number) => void
  ) => {
    if (isSeekingRef.current) return;

    const video = videoRef.current;
    if (!video || !duration || duration === 0) return;

    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT') return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    
    const timelineRange = getTimelineRange();
    const rawTime = timelineRange.min + (percentage * timelineRange.duration);
    const newTime = Math.max(timelineRange.min, Math.min(rawTime, timelineRange.max));

    if (isFinite(newTime)) {
      isSeekingRef.current = true;
      if (isPlaying) {
        video.pause();
      }
      video.currentTime = newTime;
      setCurrentTime(newTime);
      isSeekingRef.current = false;
    }
  }, [duration, getTimelineRange, videoRef]);

  // 計算進度百分比（基於當前時間軸範圍）
  const getProgressPercentage = useCallback((currentTime: number): number => {
    if (!duration || duration === 0) return 0;
    
    if (currentPreviewSegment) {
      const segmentDuration = currentPreviewSegment.endTime - currentPreviewSegment.startTime;
      if (segmentDuration <= 0) return 0;
      
      const relativeTime = Math.max(0, currentTime - currentPreviewSegment.startTime);
      return Math.max(0, Math.min(100, (relativeTime / segmentDuration) * 100));
    }
    
    return (currentTime / duration) * 100;
  }, [duration, currentPreviewSegment]);

  return {
    handleSeekStart,
    handleSeek,
    handleSeekEnd,
    handleProgressClick,
    getTimelineRange,
    getProgressPercentage,
  };
}
