import { describe, it, expect, beforeEach } from 'vitest';
import { useClipStore } from './clipStore';
import { ClipSegment } from '../../shared/types';

describe('clipStore', () => {
  beforeEach(() => {
    // 重置 store 狀態
    useClipStore.getState().clearSegments();
  });

  it('應該正確添加片段', () => {
    const store = useClipStore.getState();
    const segment: ClipSegment = {
      id: '1',
      name: '測試片段',
      startTime: 0,
      endTime: 30,
    };
    
    store.addSegment(segment);
    const segments = useClipStore.getState().segments;
    
    expect(segments).toHaveLength(1);
    expect(segments[0]).toEqual(segment);
  });

  it('應該正確更新片段', () => {
    const store = useClipStore.getState();
    const segment: ClipSegment = {
      id: '1',
      name: '原始片段',
      startTime: 0,
      endTime: 30,
    };
    
    store.addSegment(segment);
    
    const updatedSegment: ClipSegment = {
      id: '1',
      name: '更新後的片段',
      startTime: 10,
      endTime: 40,
    };
    
    store.updateSegment('1', updatedSegment);
    const segments = useClipStore.getState().segments;
    
    expect(segments).toHaveLength(1);
    expect(segments[0].name).toBe('更新後的片段');
    expect(segments[0].startTime).toBe(10);
    expect(segments[0].endTime).toBe(40);
  });

  it('應該正確刪除片段', () => {
    const store = useClipStore.getState();
    const segment1: ClipSegment = {
      id: '1',
      name: '片段1',
      startTime: 0,
      endTime: 30,
    };
    const segment2: ClipSegment = {
      id: '2',
      name: '片段2',
      startTime: 30,
      endTime: 60,
    };
    
    store.addSegment(segment1);
    store.addSegment(segment2);
    
    expect(useClipStore.getState().segments).toHaveLength(2);
    
    store.deleteSegment('1');
    const segments = useClipStore.getState().segments;
    
    expect(segments).toHaveLength(1);
    expect(segments[0].id).toBe('2');
  });

  it('應該正確清除所有片段', () => {
    const store = useClipStore.getState();
    const segment1: ClipSegment = {
      id: '1',
      name: '片段1',
      startTime: 0,
      endTime: 30,
    };
    const segment2: ClipSegment = {
      id: '2',
      name: '片段2',
      startTime: 30,
      endTime: 60,
    };
    
    store.addSegment(segment1);
    store.addSegment(segment2);
    
    expect(useClipStore.getState().segments).toHaveLength(2);
    
    store.clearSegments();
    expect(useClipStore.getState().segments).toHaveLength(0);
  });

  it('應該在更新不存在的片段時不改變狀態', () => {
    const store = useClipStore.getState();
    const segment: ClipSegment = {
      id: '1',
      name: '片段1',
      startTime: 0,
      endTime: 30,
    };
    
    store.addSegment(segment);
    
    const nonExistentSegment: ClipSegment = {
      id: '999',
      name: '不存在的片段',
      startTime: 0,
      endTime: 30,
    };
    
    store.updateSegment('999', nonExistentSegment);
    const segments = useClipStore.getState().segments;
    
    expect(segments).toHaveLength(1);
    expect(segments[0].id).toBe('1');
  });
});
