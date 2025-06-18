import { useState, useEffect } from "react";
import { apiService } from "../services/api";

export default function SystemStatus() {
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        系統狀態
      </h2>
      <p className="text-gray-600 dark:text-gray-400">後端狀態: {apiStatus}</p>
    </div>
  );
}
