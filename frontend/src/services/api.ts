import axios from "axios";

// 建立 axios 實例
const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 請求攔截器
api.interceptors.request.use(
  (config) => {
    console.log("發送請求:", config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 回應攔截器
api.interceptors.response.use(
  (response) => {
    console.log("收到回應:", response);
    return response;
  },
  (error) => {
    console.error("API 錯誤:", error);
    return Promise.reject(error);
  }
);

// API 方法
export const apiService = {
  // 測試連接
  testConnection: async () => {
    const response = await api.get("/test");
    return response.data;
  },

  // 健康檢查
  healthCheck: async () => {
    const response = await axios.get("http://localhost:3001/health");
    return response.data;
  },
};

export default api;
