import { useState, useEffect } from "react";
import { apiService } from "./services/api";
import PatientBasicInfoSearch from "./components/PatientBasicInfoSearch";

function App() {
  const [apiStatus, setApiStatus] = useState<string>("檢查中...");

  // 檢查後端連接
  const checkBackendConnection = async () => {
    try {
      const health = await apiService.healthCheck();
      setApiStatus("後端連接正常 ✅");
      console.log("健康檢查:", health);
    } catch (error) {
      console.error("後端連接失敗:", error);
      setApiStatus("後端連接失敗 ❌");
    }
  };

  useEffect(() => {
    checkBackendConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
          醫療記錄系統
        </h1>

        {/* 系統狀態 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            系統狀態
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            後端狀態: {apiStatus}
          </p>
        </div>

        {/* 內容區域 */}
        <PatientBasicInfoSearch />
      </div>
    </div>
  );
}

export default App;
