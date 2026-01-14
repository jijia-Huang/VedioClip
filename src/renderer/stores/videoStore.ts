import { create } from 'zustand';
import { VideoInfo, ClipSegment } from '../../shared/types';

interface VideoState {
  videoPath: string | null;
  videoInfo: VideoInfo | null;
  loading: boolean;
  error: string | null;
  // 預覽功能相關狀態
  seekRequest: { time: number; timestamp: number } | null;
  playRequest: { timestamp: number } | null;
  currentPreviewSegment: { id: string; name: string; startTime: number; endTime: number } | null;
  // 循環播放狀態
  loop: boolean;
}

interface VideoActions {
  setVideoPath: (path: string | null) => void;
  setVideoInfo: (info: VideoInfo | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearVideo: () => void;
  // 預覽功能相關方法
  seekTo: (time: number) => void;
  play: () => void;
  setPreviewSegment: (segment: ClipSegment | null) => void;
  clearPreview: () => void;
  // 循環播放方法
  toggleLoop: () => void;
}

type VideoStore = VideoState & VideoActions;

const initialState: VideoState = {
  videoPath: null,
  videoInfo: null,
  loading: false,
  error: null,
  seekRequest: null,
  playRequest: null,
  currentPreviewSegment: null,
  loop: false,
};

export const useVideoStore = create<VideoStore>((set) => ({
  ...initialState,

  setVideoPath: (path) => set({ videoPath: path }),

  setVideoInfo: (info) => set({ videoInfo: info }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearVideo: () => set(initialState),

  // 請求跳轉到指定時間點
  seekTo: (time: number) => {
    set({
      seekRequest: {
        time,
        timestamp: Date.now(), // 使用 timestamp 確保即使時間相同也能觸發更新
      },
    });
  },

  // 請求播放
  play: () => {
    set({
      playRequest: {
        timestamp: Date.now(),
      },
    });
  },

  // 設定當前預覽片段
  setPreviewSegment: (segment: ClipSegment | null) => {
    if (segment) {
      set({
        currentPreviewSegment: {
          id: segment.id,
          name: segment.name,
          startTime: segment.startTime,
          endTime: segment.endTime,
        },
      });
    } else {
      set({ currentPreviewSegment: null });
    }
  },

  // 清除預覽狀態，返回原影片模式
  clearPreview: () => {
    set({ currentPreviewSegment: null });
  },

  // 切換循環播放狀態
  toggleLoop: () => {
    set((state) => ({ loop: !state.loop }));
  },
}));
