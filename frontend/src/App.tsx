import { useState, useEffect } from "react";
import { apiService } from "./services/api";
import "./App.css";

interface ApiResponse {
  message: string;
  success?: boolean;
  status?: string;
  timestamp?: string;
}

function App() {
  const [apiStatus, setApiStatus] = useState<string>("檢查中...");
  const [testResult, setTestResult] = useState<ApiResponse | null>(null);
  const [healthResult, setHealthResult] = useState<ApiResponse | null>(null);

  // 檢查後端連接
  const checkBackendConnection = async () => {
    try {
      const health = await apiService.healthCheck();
      setHealthResult(health);
      setApiStatus("後端連接正常 ✅");
    } catch (error) {
      console.error("後端連接失敗:", error);
      setApiStatus("後端連接失敗 ❌");
    }
  };

  // 測試 API
  const testApi = async () => {
    try {
      const result = await apiService.testConnection();
      setTestResult(result);
    } catch (error) {
      console.error("API 測試失敗:", error);
      setTestResult({ message: "API 測試失敗", success: false });
    }
  };

  useEffect(() => {
    checkBackendConnection();
  }, []);

  return (
    <div className="app-container">
      <h1>醫療記錄系統</h1>
      <div className="status-section">
        <h2>系統狀態</h2>
        <p>後端狀態: {apiStatus}</p>

        {healthResult && (
          <div className="health-info">
            <p>伺服器狀態: {healthResult.status}</p>
            <p>檢查時間: {healthResult.timestamp}</p>
          </div>
        )}
      </div>

      <div className="test-section">
        <h2>API 測試</h2>
        <button onClick={testApi} className="test-button">
          測試 API 連接
        </button>

        {testResult && (
          <div className="test-result">
            <h3>測試結果:</h3>
            <pre>{JSON.stringify(testResult, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="actions-section">
        <button onClick={checkBackendConnection} className="refresh-button">
          重新檢查後端狀態
        </button>
      </div>
    </div>
  );
}

export default App;
