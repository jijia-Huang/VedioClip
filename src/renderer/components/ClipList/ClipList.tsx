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
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4 flex flex-col flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-100">剪輯片段</h2>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingSegment(null);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          新增片段
        </button>
      </div>

      {/* 新增/編輯表單 */}
      {(showAddForm || editingSegment) && (
        <div className="mb-4">
          <ClipEditor
            segment={editingSegment}
            onClose={handleCloseEditor}
          />
        </div>
      )}

      {/* 片段列表表格 */}
      {segments.length === 0 ? (
        <div className="text-center py-8 text-gray-400 flex items-center justify-center min-h-[200px]">
          <div>
            <p>目前沒有片段</p>
            <p className="text-sm mt-2">點擊「新增片段」按鈕開始建立片段</p>
          </div>
        </div>
      ) : (
        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full text-sm">
            <thead className="bg-gray-700 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-12">
                  #
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  名稱
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  開始
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  結束
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-300 uppercase tracking-wider w-24">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {segments.map((segment, index) => (
                <tr key={segment.id} className="hover:bg-gray-700">
                  <td className="px-3 py-2 text-gray-300">{index + 1}</td>
                  <td className="px-3 py-2 font-medium text-gray-100">{segment.name}</td>
                  <td className="px-3 py-2 text-gray-400 font-mono text-xs">
                    {formatTime(segment.startTime, true)}
                  </td>
                  <td className="px-3 py-2 text-gray-400 font-mono text-xs">
                    {formatTime(segment.endTime, true)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => handleEdit(segment)}
                        className="px-2 py-1 text-xs bg-gray-700 text-gray-200 rounded hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-500"
                        title="編輯"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDelete(segment.id)}
                        className="px-2 py-1 text-xs bg-red-900 text-red-200 rounded hover:bg-red-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                        title="刪除"
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
