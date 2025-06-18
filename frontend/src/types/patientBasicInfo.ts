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
}

// API 回應格式
export interface PatientBasicInfoResponse {
  success: boolean;
  data?: PatientBasicInfo;
  message?: string;
}
