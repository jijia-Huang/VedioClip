import { VideoLoader, VideoInfoDisplay } from './components/VideoLoader';
import { VideoPlayer } from './components/VideoPlayer';
import { ClipList } from './components/ClipList/ClipList';
import { ExportPanel } from './components/ExportPanel/ExportPanel';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          VedioClip
        </h1>
        <p className="text-gray-600 mb-6">
          桌面影片剪輯工具
        </p>
        
        <VideoLoader />
        <VideoInfoDisplay />
        
        <div className="mt-6">
          <VideoPlayer />
        </div>

        <div className="mt-6">
          <ClipList />
        </div>

        <div className="mt-6">
          <ExportPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
