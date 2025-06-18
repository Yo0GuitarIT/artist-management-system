// 藝人基本檔資料類型
export interface ArtistBasicInfo {
  id: number;
  artistId: string;
  stageName: string;
  realName?: string;
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
  artistDetail?: ArtistDetail; // 關聯的明細資料
}

// 藝人明細資料類型
export interface ArtistDetail {
  id: number;
  artistId: string;
  stageName?: string; // 藝名（可編輯）
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
  nationalities?: ArtistNationality[]; // 國籍資料陣列
  languages?: ArtistLanguage[]; // 語言資料陣列
  religions?: ArtistReligion[]; // 宗教資料陣列
}

// 藝人國籍資料類型
export interface ArtistNationality {
  id: number;
  artistId: string;
  nationalityCode: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

// 藝人語言資料類型
export interface ArtistLanguage {
  id: number;
  artistId: string;
  languageCode: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

// 藝人宗教資料類型
export interface ArtistReligion {
  id: number;
  artistId: string;
  religionCode: string;
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
export interface ArtistBasicInfoResponse {
  success: boolean;
  data?: ArtistBasicInfo;
  message?: string;
}

export interface ArtistDetailResponse {
  success: boolean;
  data?: ArtistDetail;
  message?: string;
}

export interface CodeOptionsResponse {
  success: boolean;
  data?: CodeOption[];
  message?: string;
}

export interface ArtistNationalityResponse {
  success: boolean;
  data?: ArtistNationality | ArtistNationality[];
  message?: string;
}
