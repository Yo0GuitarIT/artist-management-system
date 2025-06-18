// 病人基本檔資料類型
export interface PatientBasicInfo {
  id: number;
  mrn: string;
  ptName: string;
  ptNameFull?: string;
  birthDate?: string;
  gender?: string;
  genderName?: string;
  maritalStatus?: string;
  maritalStatusName?: string;
  email?: string;
  educationNo?: string;
  educationNoName?: string;
  lowIncome?: string;
  lowIncomeName?: string;
  nationalityCode?: string;
  nationalityCodeName?: string;
  mainLang?: string;
  mainLangName?: string;
  religion?: string;
  religionName?: string;
  idType?: string;
  idTypeName?: string;
  idNo?: string;
  createdAt: string;
  updatedAt: string;
  patientDetail?: PatientDetail; // 關聯的明細資料
}

// 病人明細資料類型
export interface PatientDetail {
  id: number;
  mrn: string;
  ptName?: string; // 病人姓名（可編輯）
  fullName?: string;
  birthDate?: string;
  biologicalGender?: string;
  maritalStatus?: string;
  bloodTypeABO?: string;
  bloodTypeRH?: string;
  email?: string;
  educationLevel?: string;
  incomeLevel?: string;
  createdAt: string;
  updatedAt: string;
  nationalities?: PatientNationality[]; // 國籍資料陣列
}

// 病人國籍資料類型
export interface PatientNationality {
  id: number;
  mrn: string;
  nationalityCode: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

// 代號選項類型
export interface CodeOption {
  id: number;
  category: string;
  code: string;
  name: string;
  description?: string;
  displayOrder?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API 回應格式
export interface PatientBasicInfoResponse {
  success: boolean;
  data?: PatientBasicInfo;
  message?: string;
}

export interface PatientDetailResponse {
  success: boolean;
  data?: PatientDetail;
  message?: string;
}

export interface CodeOptionsResponse {
  success: boolean;
  data?: CodeOption[];
  message?: string;
}

export interface PatientNationalityResponse {
  success: boolean;
  data?: PatientNationality | PatientNationality[];
  message?: string;
}
