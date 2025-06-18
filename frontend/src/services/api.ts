import axios from "axios";
import type {
  PatientBasicInfoResponse,
  PatientDetail,
  PatientNationality,
  PatientDetailResponse,
  CodeOptionsResponse,
  PatientNationalityResponse,
} from "../types/patientBasicInfo";

// 基本 API 回應型別
interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

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
  // 健康檢查
  healthCheck: async (): Promise<ApiResponse> => {
    const response = await axios.get("http://localhost:3001/health");
    return response.data;
  },

  // 病人基本檔操作
  patientBasicInfo: {
    // 根據病歷號查詢病人基本資料
    getByMrn: async (mrn: string): Promise<PatientBasicInfoResponse> => {
      const response = await api.get(`/patient-basic-info/${mrn}`);
      return response.data;
    },
  },

  // 病人明細資料操作
  patientDetail: {
    // 新增或更新病人明細資料
    createOrUpdate: async (
      patientDetailData: Omit<PatientDetail, "id" | "createdAt" | "updatedAt">
    ): Promise<PatientDetailResponse> => {
      const response = await api.post("/patient-detail", patientDetailData);
      return response.data;
    },
  },

  // 代號選項操作
  codeOptions: {
    // 根據分類取得代號選項
    getByCategory: async (category: string): Promise<CodeOptionsResponse> => {
      const response = await api.get(`/code-options/${category}`);
      return response.data;
    },
  },

  // 國籍資料操作
  patientNationality: {
    // 取得病人的國籍資料
    getByMrn: async (mrn: string): Promise<PatientNationalityResponse> => {
      const response = await api.get(`/patient-nationality/${mrn}`);
      return response.data;
    },

    // 新增國籍資料
    create: async (data: {
      mrn: string;
      nationalityCode: string;
    }): Promise<PatientNationalityResponse> => {
      const response = await api.post("/patient-nationality", data);
      return response.data;
    },

    // 更新國籍資料
    update: async (
      id: number,
      data: { nationalityCode?: string; isPrimary?: boolean }
    ): Promise<PatientNationalityResponse> => {
      const response = await api.put(`/patient-nationality/${id}`, data);
      return response.data;
    },

    // 刪除國籍資料
    delete: async (
      id: number
    ): Promise<{ success: boolean; message?: string }> => {
      const response = await api.delete(`/patient-nationality/${id}`);
      return response.data;
    },

    // 批次更新國籍資料
    batchUpdate: async (data: {
      mrn: string;
      nationalities: PatientNationality[];
    }): Promise<PatientNationalityResponse> => {
      const response = await api.post("/patient-nationality/batch", data);
      return response.data;
    },
  },
};

export default api;
