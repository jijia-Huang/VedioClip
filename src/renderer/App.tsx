import { Header } from './components/Header';
import { StatusBar } from './components/StatusBar';
import { VideoPlayer } from './components/VideoPlayer';
import { ClipList } from './components/ClipList';
import { ExportPanel } from './components/ExportPanel';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-gray-900">
        {/* 頂部標題列 */}
        <Header />

        {/* 主要內容區域（左右分欄） */}
        <div className="flex-1 flex overflow-hidden">
          {/* 左側預覽區域（65-70%） */}
          <div className="flex-[0.67] p-4 flex flex-col min-w-0">
            <VideoPlayer />
          </div>

          {/* 右側片段管理區域（30-35%） */}
          <div className="flex-[0.33] p-4 flex flex-col gap-4 min-w-0 border-l border-gray-700 bg-gray-800 overflow-y-auto">
            <ClipList />
            <ExportPanel />
          </div>
        </div>

        {/* 底部狀態列 */}
        <StatusBar />
      </div>
    </ErrorBoundary>
  );
}

export default App;
