// 病患記錄介面
export interface Patient {
  id: number;
  name: string;
  age: number;
  phone: string;
  diagnosis: string;
  createdAt: string;
  updatedAt: string;
}

// API 回應介面
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
}

// 新增/編輯病患的表單資料
export interface PatientFormData {
  name: string;
  age: number | string;
  phone: string;
  diagnosis: string;
}
