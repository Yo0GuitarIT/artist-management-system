import axios from "axios";
import type {
  ArtistBasicInfoResponse,
  ArtistDetail,
  ArtistDetailResponse,
  CodeOptionsResponse,
} from "../types/artistBasicInfo";

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

  // 藝人基本檔操作
  artistBasicInfo: {
    // 根據藝人編號查詢藝人基本資料
    getByArtistId: async (
      artistId: string
    ): Promise<ArtistBasicInfoResponse> => {
      const response = await api.get(`/artist-basic-info/${artistId}`);
      return response.data;
    },
  },

  // 藝人明細資料操作
  artistDetail: {
    // 新增或更新藝人明細資料
    createOrUpdate: async (
      artistDetailData: Omit<ArtistDetail, "id" | "createdAt" | "updatedAt">
    ): Promise<ArtistDetailResponse> => {
      const response = await api.post("/artist-detail", artistDetailData);
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
  artistNationality: {
    // 刪除國籍資料 (立即執行)
    delete: async (
      id: number
    ): Promise<{ success: boolean; message?: string }> => {
      const response = await api.delete(`/artist-nationality/${id}`);
      return response.data;
    },
  },

  // 語言資料操作
  artistLanguage: {
    // 刪除語言資料 (立即執行)
    delete: async (
      id: number
    ): Promise<{ success: boolean; message?: string }> => {
      const response = await api.delete(`/artist-language/${id}`);
      return response.data;
    },
  },

  // 宗教資料操作
  artistReligion: {
    // 刪除宗教資料 (立即執行)
    delete: async (
      id: number
    ): Promise<{ success: boolean; message?: string }> => {
      const response = await api.delete(`/artist-religion/${id}`);
      return response.data;
    },
  },

  // 身份證件資料操作
  artistIdDocument: {
    // 刪除身份證件資料 (立即執行)
    delete: async (
      id: number
    ): Promise<{ success: boolean; message?: string }> => {
      const response = await api.delete(`/artist-id-document/${id}`);
      return response.data;
    },
  },
};

export default api;
