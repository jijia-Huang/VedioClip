import { create } from 'zustand';
import { VideoInfo } from '../../shared/types';

interface VideoState {
  videoPath: string | null;
  videoInfo: VideoInfo | null;
  loading: boolean;
  error: string | null;
}

interface VideoActions {
  setVideoPath: (path: string | null) => void;
  setVideoInfo: (info: VideoInfo | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearVideo: () => void;
}

type VideoStore = VideoState & VideoActions;

const initialState: VideoState = {
  videoPath: null,
  videoInfo: null,
  loading: false,
  error: null,
};

export const useVideoStore = create<VideoStore>((set) => ({
  ...initialState,

  setVideoPath: (path) => set({ videoPath: path }),

  setVideoInfo: (info) => set({ videoInfo: info }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearVideo: () => set(initialState),
}));
