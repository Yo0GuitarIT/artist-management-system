import axios from "axios";
import type { Patient, ApiResponse, PatientFormData } from "../types/patient";
import type {
  PatientBasicInfo,
  PatientBasicInfoResponse,
} from "../types/patientBasicInfo";

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
  testConnection: async (): Promise<ApiResponse> => {
    const response = await api.get("/test");
    return response.data;
  },

  // 健康檢查
  healthCheck: async (): Promise<ApiResponse> => {
    const response = await axios.get("http://localhost:3001/health");
    return response.data;
  },

  // 病患 CRUD 操作
  patients: {
    // 取得所有病患記錄
    getAll: async (): Promise<ApiResponse<Patient[]>> => {
      const response = await api.get("/patients");
      return response.data;
    },

    // 取得單一病患記錄
    getById: async (id: number): Promise<ApiResponse<Patient>> => {
      const response = await api.get(`/patients/${id}`);
      return response.data;
    },

    // 新增病患記錄
    create: async (
      patientData: PatientFormData
    ): Promise<ApiResponse<Patient>> => {
      const response = await api.post("/patients", patientData);
      return response.data;
    },

    // 更新病患記錄
    update: async (
      id: number,
      patientData: Partial<PatientFormData>
    ): Promise<ApiResponse<Patient>> => {
      const response = await api.put(`/patients/${id}`, patientData);
      return response.data;
    },

    // 刪除病患記錄
    delete: async (id: number): Promise<ApiResponse<Patient>> => {
      const response = await api.delete(`/patients/${id}`);
      return response.data;
    },
  },

  // 病人基本檔操作
  patientBasicInfo: {
    // 根據病歷號查詢病人基本資料
    getByMrn: async (mrn: string): Promise<PatientBasicInfoResponse> => {
      const response = await api.get(`/patient-basic-info/${mrn}`);
      return response.data;
    },

    // 新增病人基本資料
    create: async (
      patientData: Omit<PatientBasicInfo, "id" | "createdAt" | "updatedAt">
    ): Promise<PatientBasicInfoResponse> => {
      const response = await api.post("/patient-basic-info", patientData);
      return response.data;
    },

    // 更新病人基本資料
    update: async (
      mrn: string,
      patientData: Partial<
        Omit<PatientBasicInfo, "id" | "mrn" | "createdAt" | "updatedAt">
      >
    ): Promise<PatientBasicInfoResponse> => {
      const response = await api.put(`/patient-basic-info/${mrn}`, patientData);
      return response.data;
    },
  },
};

export default api;
