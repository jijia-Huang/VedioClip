import { useState, useEffect } from 'react';
import { ClipSegment } from '../../../shared/types';
import { useClipStore } from '../../stores/clipStore';
import { useVideoStore } from '../../stores/videoStore';
import { validationService } from '../../services';
import { TimeInput } from './TimeInput';

interface ClipEditorProps {
  segment?: ClipSegment | null; // 如果提供，則是編輯模式；否則為新增模式
  onClose: () => void;
}

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function ClipEditor({ segment, onClose }: ClipEditorProps) {
  const addSegment = useClipStore((state) => state.addSegment);
  const updateSegment = useClipStore((state) => state.updateSegment);
  const videoInfo = useVideoStore((state) => state.videoInfo);

  const [name, setName] = useState(segment?.name || '');
  const [startTime, setStartTime] = useState(segment?.startTime || 0);
  const [endTime, setEndTime] = useState(segment?.endTime || 0);
  const [error, setError] = useState<string | null>(null);

  // 當 segment 改變時更新表單
  useEffect(() => {
    if (segment) {
      setName(segment.name);
      setStartTime(segment.startTime);
      setEndTime(segment.endTime);
    } else {
      setName('');
      setStartTime(0);
      setEndTime(0);
    }
    setError(null);
  }, [segment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 驗證片段
    const validation = validationService.validateSegment(
      { name: name.trim(), startTime, endTime },
      videoInfo
    );

    if (!validation.valid) {
      setError(validation.error || '驗證失敗');
      return;
    }

    // 新增或更新片段
    if (segment) {
      // 編輯模式：更新現有片段
      updateSegment(segment.id, {
        id: segment.id,
        name: name.trim(),
        startTime,
        endTime,
      });
    } else {
      // 新增模式：創建新片段
      addSegment({
        id: generateId(),
        name: name.trim(),
        startTime,
        endTime,
      });
    }

    onClose();
  };

  const maxSeconds = videoInfo?.duration || undefined;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
      <h2 className="text-xl font-bold text-gray-100 mb-4">
        {segment ? '編輯片段' : '新增片段'}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* 名稱輸入 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            片段名稱
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
            placeholder="例如：開場片段"
            required
          />
        </div>

        {/* 開始時間輸入 */}
        <div className="mb-4">
          <TimeInput
            value={startTime}
            onChange={setStartTime}
            label="開始時間"
            maxSeconds={maxSeconds}
          />
        </div>

        {/* 結束時間輸入 */}
        <div className="mb-4">
          <TimeInput
            value={endTime}
            onChange={setEndTime}
            label="結束時間"
            maxSeconds={maxSeconds}
          />
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-md text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* 按鈕 */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {segment ? '更新' : '新增'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
