import { create } from 'zustand';
import { ClipSegment, ClipValidationResult } from '../../shared/types';
import { useVideoStore } from './videoStore';

interface ClipState {
  segments: ClipSegment[];
}

interface ClipActions {
  addSegment: (segment: Omit<ClipSegment, 'id'>) => ClipValidationResult;
  updateSegment: (id: string, segment: Omit<ClipSegment, 'id'>) => ClipValidationResult;
  deleteSegment: (id: string) => void;
  clearSegments: () => void;
}

type ClipStore = ClipState & ClipActions;

const initialState: ClipState = {
  segments: [],
};

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 驗證片段
 */
function validateSegment(segment: Omit<ClipSegment, 'id'>): ClipValidationResult {
  // 驗證名稱
  if (!segment.name || segment.name.trim() === '') {
    return {
      valid: false,
      error: '片段名稱不能為空',
    };
  }

  // 驗證時間範圍
  if (segment.startTime < 0) {
    return {
      valid: false,
      error: '開始時間不能為負數',
    };
  }

  if (segment.endTime <= segment.startTime) {
    return {
      valid: false,
      error: '結束時間必須大於開始時間',
    };
  }

  // 驗證影片長度
  const videoInfo = useVideoStore.getState().videoInfo;
  if (videoInfo) {
    if (segment.startTime >= videoInfo.duration) {
      return {
        valid: false,
        error: `開始時間不能超過影片長度（${videoInfo.duration.toFixed(2)} 秒）`,
      };
    }
    if (segment.endTime > videoInfo.duration) {
      return {
        valid: false,
        error: `結束時間不能超過影片長度（${videoInfo.duration.toFixed(2)} 秒）`,
      };
    }
  }

  return { valid: true };
}

export const useClipStore = create<ClipStore>((set) => ({
  ...initialState,

  addSegment: (segment) => {
    const validation = validateSegment(segment);
    if (!validation.valid) {
      return validation;
    }

    const newSegment: ClipSegment = {
      ...segment,
      id: generateId(),
    };

    set((state) => ({
      segments: [...state.segments, newSegment],
    }));

    return { valid: true };
  },

  updateSegment: (id, segment) => {
    const validation = validateSegment(segment);
    if (!validation.valid) {
      return validation;
    }

    set((state) => ({
      segments: state.segments.map((s) =>
        s.id === id ? { ...segment, id } : s
      ),
    }));

    return { valid: true };
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

// 當影片被清除時，同時清除片段
useVideoStore.subscribe(
  (state) => {
    if (!state.videoPath) {
      useClipStore.getState().clearSegments();
    }
  }
);
