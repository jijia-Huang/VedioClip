import { describe, it, expect, beforeEach } from 'vitest';
import { useVideoStore } from './videoStore';
import { VideoInfo } from '../../shared/types';

describe('videoStore', () => {
  beforeEach(() => {
    // 重置 store 狀態
    useVideoStore.getState().clearVideo();
  });

  it('應該正確設置和清除影片路徑', () => {
    const store = useVideoStore.getState();
    
    expect(store.videoPath).toBeNull();
    
    store.setVideoPath('file:///C:/test/video.mp4');
    expect(useVideoStore.getState().videoPath).toBe('file:///C:/test/video.mp4');
    
    store.clearVideo();
    expect(useVideoStore.getState().videoPath).toBeNull();
  });

  it('應該正確設置影片資訊', () => {
    const store = useVideoStore.getState();
    const videoInfo: VideoInfo = {
      duration: 120,
      width: 1920,
      height: 1080,
      bitrate: 5000000,
      format: 'mp4',
      size: 100000000,
    };
    
    store.setVideoInfo(videoInfo);
    expect(useVideoStore.getState().videoInfo).toEqual(videoInfo);
  });

  it('應該正確處理載入和錯誤狀態', () => {
    const store = useVideoStore.getState();
    
    store.setLoading(true);
    expect(useVideoStore.getState().loading).toBe(true);
    
    store.setError('載入失敗');
    expect(useVideoStore.getState().error).toBe('載入失敗');
    
    store.setLoading(false);
    store.setError(null);
    expect(useVideoStore.getState().loading).toBe(false);
    expect(useVideoStore.getState().error).toBeNull();
  });

  it('應該正確處理跳轉請求', () => {
    const store = useVideoStore.getState();
    
    store.seekTo(30);
    const seekRequest = useVideoStore.getState().seekRequest;
    
    expect(seekRequest).not.toBeNull();
    expect(seekRequest?.time).toBe(30);
    expect(seekRequest?.timestamp).toBeGreaterThan(0);
  });

  it('應該正確處理播放請求', () => {
    const store = useVideoStore.getState();
    
    store.play();
    const playRequest = useVideoStore.getState().playRequest;
    
    expect(playRequest).not.toBeNull();
    expect(playRequest?.timestamp).toBeGreaterThan(0);
  });

  it('應該正確切換循環播放狀態', () => {
    const store = useVideoStore.getState();
    
    expect(store.loop).toBe(false);
    
    store.toggleLoop();
    expect(useVideoStore.getState().loop).toBe(true);
    
    store.toggleLoop();
    expect(useVideoStore.getState().loop).toBe(false);
  });
});
