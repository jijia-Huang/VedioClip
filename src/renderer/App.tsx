import { Header } from './components/Header/Header';
import { StatusBar } from './components/StatusBar/StatusBar';
import { VideoPlayer } from './components/VideoPlayer';
import { ClipList } from './components/ClipList/ClipList';
import { ExportPanel } from './components/ExportPanel/ExportPanel';

function App() {
  return (
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
        <div className="flex-[0.33] p-4 flex flex-col gap-4 min-w-0 border-l border-gray-700 bg-gray-800">
          <ClipList />
          <ExportPanel />
        </div>
      </div>

      {/* 底部狀態列 */}
      <StatusBar />
    </div>
  );
}

export default App;
