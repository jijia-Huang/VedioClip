import { create } from 'zustand';
import { ClipSegment } from '../../shared/types';

interface ClipState {
  segments: ClipSegment[];
}

interface ClipActions {
  addSegment: (segment: ClipSegment) => void;
  updateSegment: (id: string, segment: ClipSegment) => void;
  deleteSegment: (id: string) => void;
  clearSegments: () => void;
}

type ClipStore = ClipState & ClipActions;

const initialState: ClipState = {
  segments: [],
};

export const useClipStore = create<ClipStore>((set) => ({
  ...initialState,

  addSegment: (segment) => {
    set((state) => ({
      segments: [...state.segments, segment],
    }));
  },

  updateSegment: (id, segment) => {
    set((state) => ({
      segments: state.segments.map((s) =>
        s.id === id ? { ...segment, id } : s
      ),
    }));
  },

  deleteSegment: (id) => {
    set((state) => ({
      segments: state.segments.filter((s) => s.id !== id),
    }));
  },

  clearSegments: () => {
    set({ segments: [] });
  },
}));
