import ArtistManagement from "./components/ArtistManagement";
import SystemStatus from "./components/SystemStatus";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 系統狀態 */}
        <SystemStatus />

        {/* 內容區域 */}
        <ArtistManagement />
      </div>
    </div>
  );
}

export default App;
