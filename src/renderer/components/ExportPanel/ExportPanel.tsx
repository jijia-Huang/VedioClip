import { useState, useEffect } from 'react';
import { useClipStore } from '../../stores/clipStore';
import { useVideoStore } from '../../stores/videoStore';
import { ExportSettings, ExportFormat, ExportQuality, ExportProgress, BatchExportResult, ClipSegment } from '../../../shared/types';

export function ExportPanel() {
  const segments = useClipStore((state) => state.segments);
  const videoPath = useVideoStore((state) => state.videoPath);

  const [outputDir, setOutputDir] = useState('');
  const [format, setFormat] = useState<ExportFormat>('mp4');
  const [quality, setQuality] = useState<ExportQuality>('high');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<ExportProgress | null>(null);
  const [exportResult, setExportResult] = useState<BatchExportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 監聽匯出進度
  useEffect(() => {
    if (!window.electronAPI) return;

    const handleProgress = (progressData: any) => {
      setProgress(progressData as ExportProgress);
    };

    window.electronAPI.onExportProgress(handleProgress);

    return () => {
      window.electronAPI.removeExportProgressListener();
    };
  }, []);

  const handleSelectOutputDir = async () => {
    try {
      const result = await window.electronAPI.selectExportDir();
      if (result.success && result.data) {
        setOutputDir(result.data);
        setError(null);
      } else if (result.error && result.error !== '使用者取消選擇') {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '選擇目錄失敗');
    }
  };

  const handleExport = async () => {
    if (!videoPath) {
      setError('請先載入影片');
      return;
    }

    if (segments.length === 0) {
      setError('沒有可匯出的片段');
      return;
    }

    if (!outputDir) {
      setError('請選擇輸出目錄');
      return;
    }

    setIsExporting(true);
    setError(null);
    setProgress(null);
    setExportResult(null);

    try {
      const settings: ExportSettings = {
        outputDir,
        format,
        quality,
      };

      const result = await window.electronAPI.exportClips(
        videoPath,
        segments as ClipSegment[],
        settings
      ) as { success: boolean; data?: BatchExportResult; error?: string };

      if (result.success && result.data) {
        setExportResult(result.data);
      } else {
        setError(result.error || '匯出失敗');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '匯出失敗');
    } finally {
      setIsExporting(false);
      setProgress(null);
    }
  };

  if (!videoPath || segments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">匯出片段</h2>
        <p className="text-gray-600">
          {!videoPath ? '請先載入影片' : '請先建立片段'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">匯出片段</h2>

      {/* 輸出設定 */}
      <div className="space-y-4 mb-6">
        {/* 輸出目錄 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            輸出目錄
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={outputDir}
              onChange={(e) => setOutputDir(e.target.value)}
              placeholder="選擇輸出目錄..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isExporting}
            />
            <button
              onClick={handleSelectOutputDir}
              disabled={isExporting}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              選擇
            </button>
          </div>
        </div>

        {/* 輸出格式 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            輸出格式
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as ExportFormat)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isExporting}
          >
            <option value="mp4">MP4</option>
            <option value="avi">AVI</option>
            <option value="mov">MOV</option>
            <option value="mkv">MKV</option>
            <option value="webm">WebM</option>
          </select>
        </div>

        {/* 輸出品質 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            輸出品質
          </label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value as ExportQuality)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isExporting}
          >
            <option value="high">高品質（原始品質或 5000k）</option>
            <option value="medium">中品質（2500k）</option>
            <option value="low">低品質（1000k）</option>
          </select>
        </div>
      </div>

      {/* 匯出按鈕 */}
      <button
        onClick={handleExport}
        disabled={isExporting || !outputDir}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isExporting ? '匯出中...' : `匯出 ${segments.length} 個片段`}
      </button>

      {/* 進度顯示 */}
      {progress && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              {progress.currentSegmentName} ({progress.currentIndex} / {progress.total})
            </span>
            <span className="text-sm text-gray-600">{progress.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* 錯誤訊息 */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* 匯出結果 */}
      {exportResult && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="font-medium text-green-800 mb-2">匯出完成</h3>
          <div className="text-sm text-green-700 space-y-1">
            <p>總數：{exportResult.total}</p>
            <p>成功：{exportResult.success}</p>
            {exportResult.failed > 0 && (
              <p className="text-red-600">失敗：{exportResult.failed}</p>
            )}
          </div>
          {exportResult.failed > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-red-700 mb-1">失敗的片段：</p>
              <ul className="text-sm text-red-600 list-disc list-inside">
                {exportResult.results
                  .filter((r) => !r.result.success)
                  .map((r) => (
                    <li key={r.segmentId}>
                      {r.segmentName}: {r.result.error}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
