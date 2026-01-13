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
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-100 mb-4">匯出片段</h2>
        <p className="text-gray-400">
          {!videoPath ? '請先載入影片' : '請先建立片段'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4">
      <h2 className="text-lg font-bold text-gray-100 mb-4">輸出設定</h2>

      {/* 輸出設定 */}
      <div className="space-y-3 mb-4">
        {/* 輸出目錄 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            輸出目錄
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={outputDir}
              onChange={(e) => setOutputDir(e.target.value)}
              placeholder="選擇輸出目錄..."
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              disabled={isExporting}
            />
            <button
              onClick={handleSelectOutputDir}
              disabled={isExporting}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              選擇
            </button>
          </div>
        </div>

        {/* 輸出格式 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            輸出格式
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as ExportFormat)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-sm font-medium text-gray-300 mb-2">
            輸出品質
          </label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value as ExportQuality)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed font-medium text-base"
      >
        {isExporting ? '匯出中...' : `開始批次輸出 (${segments.length})`}
      </button>

      {/* 進度顯示 */}
      {progress && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">
              {progress.currentSegmentName} ({progress.currentIndex} / {progress.total})
            </span>
            <span className="text-xs text-gray-400">{progress.percentage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-green-600 h-1.5 rounded-full transition-all"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* 錯誤訊息 */}
      {error && (
        <div className="mt-3 p-2 bg-red-900 border border-red-700 rounded-md text-red-200 text-xs">
          {error}
        </div>
      )}

      {/* 匯出結果 */}
      {exportResult && (
        <div className="mt-3 p-3 bg-green-900 border border-green-700 rounded-md">
          <h3 className="font-medium text-green-200 mb-1 text-sm">匯出完成</h3>
          <div className="text-xs text-green-300 space-y-0.5">
            <p>總數：{exportResult.total}</p>
            <p>成功：{exportResult.success}</p>
            {exportResult.failed > 0 && (
              <p className="text-red-400">失敗：{exportResult.failed}</p>
            )}
          </div>
          {exportResult.failed > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium text-red-300 mb-1">失敗的片段：</p>
              <ul className="text-xs text-red-400 list-disc list-inside">
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
