import { useState } from 'react';
import { useClipStore } from '../../stores/clipStore';
import { formatTime } from '../../utils/timeFormat';
import { ClipEditor } from '../ClipEditor/ClipEditor';
import { ClipSegment } from '../../../shared/types';

export function ClipList() {
  const segments = useClipStore((state) => state.segments);
  const deleteSegment = useClipStore((state) => state.deleteSegment);

  const [editingSegment, setEditingSegment] = useState<ClipSegment | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleEdit = (segment: ClipSegment) => {
    setEditingSegment(segment);
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('確定要刪除這個片段嗎？')) {
      deleteSegment(id);
    }
  };

  const handleCloseEditor = () => {
    setEditingSegment(null);
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">剪輯片段</h2>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingSegment(null);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          新增片段
        </button>
      </div>

      {/* 新增/編輯表單 */}
      {(showAddForm || editingSegment) && (
        <div className="mb-6">
          <ClipEditor
            segment={editingSegment}
            onClose={handleCloseEditor}
          />
        </div>
      )}

      {/* 片段列表 */}
      {segments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>目前沒有片段</p>
          <p className="text-sm mt-2">點擊「新增片段」按鈕開始建立片段</p>
        </div>
      ) : (
        <div className="space-y-3">
          {segments.map((segment) => (
            <div
              key={segment.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{segment.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {formatTime(segment.startTime, true)} - {formatTime(segment.endTime, true)}
                  <span className="ml-2 text-gray-400">
                    （{formatTime(segment.endTime - segment.startTime, true)}）
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(segment)}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  編輯
                </button>
                <button
                  onClick={() => handleDelete(segment.id)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  刪除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
