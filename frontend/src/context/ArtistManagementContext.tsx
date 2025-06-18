import { createContext, useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import type {
  ArtistBasicInfo,
  ArtistDetail,
  ArtistNationality,
  CodeOption,
} from "../types/artistBasicInfo";
import { useArtistBasicInfo, useCodeOptions } from "../hooks/useArtistQueries";
import { useUpdateArtistDetail } from "../hooks/useArtistMutatinons";

// 代號選項映射介面
interface CodeOptionsMap {
  biological_gender: CodeOption[];
  marital_status: CodeOption[];
  blood_type_abo: CodeOption[];
  blood_type_rh: CodeOption[];
  education_level: CodeOption[];
  income_level: CodeOption[];
  nationality: CodeOption[];
}

// Context 狀態介面
interface ArtistManagementState {
  // 搜尋相關
  searchedArtistId: string;
  isQueryLoading: boolean;

  // 編輯相關
  editingDetail: ArtistDetail | null;
  editingNationalities: ArtistNationality[];
  isSaving: boolean;

  // 錯誤處理
  error: string;

  // 資料
  artistBasicInfo: ArtistBasicInfo | null;
  codeOptions: CodeOptionsMap;
}

// Context 動作介面
interface ArtistManagementActions {
  handleSearch: (artistId: string) => void;
  handleSave: () => void;
  handleCancel: () => void;
  setEditingDetail: (detail: ArtistDetail | null) => void;
  setEditingNationalities: (nationalities: ArtistNationality[]) => void;
  setError: (error: string) => void;
  clearError: () => void;
  getOptionName: (category: keyof CodeOptionsMap, code: string) => string;
}

// 合併的 Context 型別
type ArtistManagementContextType = ArtistManagementState &
  ArtistManagementActions;

// 建立 Context
export const ArtistManagementContext = createContext<
  ArtistManagementContextType | undefined
>(undefined);

// Provider Props
interface ArtistManagementProviderProps {
  children: ReactNode;
}

// Provider 元件
export function ArtistManagementProvider({
  children,
}: ArtistManagementProviderProps) {
  // 狀態管理
  const [searchedArtistId, setSearchedArtistId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [editingDetail, setEditingDetail] = useState<ArtistDetail | null>(null);
  const [editingNationalities, setEditingNationalities] = useState<
    ArtistNationality[]
  >([]);

  // React Query hooks
  const artistQuery = useArtistBasicInfo(searchedArtistId || null);
  const biologicalGenderQuery = useCodeOptions("biological_gender");
  const maritalStatusQuery = useCodeOptions("marital_status");
  const bloodTypeABOQuery = useCodeOptions("blood_type_abo");
  const bloodTypeRHQuery = useCodeOptions("blood_type_rh");
  const educationLevelQuery = useCodeOptions("education_level");
  const incomeLevelQuery = useCodeOptions("income_level");
  const nationalityQuery = useCodeOptions("nationality");

  const updateArtistMutation = useUpdateArtistDetail();

  // 組合代號選項
  const codeOptions: CodeOptionsMap = useMemo(
    () => ({
      biological_gender: biologicalGenderQuery.data?.data || [],
      marital_status: maritalStatusQuery.data?.data || [],
      blood_type_abo: bloodTypeABOQuery.data?.data || [],
      blood_type_rh: bloodTypeRHQuery.data?.data || [],
      education_level: educationLevelQuery.data?.data || [],
      income_level: incomeLevelQuery.data?.data || [],
      nationality: nationalityQuery.data?.data || [],
    }),
    [
      biologicalGenderQuery.data,
      maritalStatusQuery.data,
      bloodTypeABOQuery.data,
      bloodTypeRHQuery.data,
      educationLevelQuery.data,
      incomeLevelQuery.data,
      nationalityQuery.data,
    ]
  );

  // 衍生狀態
  const artistBasicInfo: ArtistBasicInfo | null =
    artistQuery.data?.success && artistQuery.data.data
      ? artistQuery.data.data
      : null;
  const artistDetail = artistBasicInfo?.artistDetail || null;
  const isQueryLoading = artistQuery.isLoading;
  const isSaving = updateArtistMutation.isPending;

  // 當藝人資料載入完成時，設置編輯狀態
  useEffect(() => {
    if (artistQuery.data?.success && artistQuery.data.data) {
      const basicInfo: ArtistBasicInfo = artistQuery.data.data;

      if (basicInfo.artistDetail) {
        // 確保明細資料包含藝名
        const detailWithName = {
          ...basicInfo.artistDetail,
          stageName: basicInfo.artistDetail.stageName || basicInfo.stageName,
        };
        setEditingDetail(detailWithName);
        setEditingNationalities(basicInfo.artistDetail.nationalities || []);
      } else {
        // 建立空白明細資料供編輯
        const emptyDetail: ArtistDetail = {
          id: 0,
          artistId: searchedArtistId,
          stageName: basicInfo.stageName,
          fullName: basicInfo.realName || basicInfo.stageName,
          birthDate: basicInfo.birthDate,
          biologicalGender: "",
          maritalStatus: "",
          bloodTypeABO: "",
          bloodTypeRH: "",
          email: "",
          educationLevel: "",
          incomeLevel: "",
          createdAt: "",
          updatedAt: "",
          nationalities: [],
        };
        setEditingDetail(emptyDetail);
        setEditingNationalities([]);
      }
    }
  }, [artistQuery.data, searchedArtistId]);

  // 動作函數
  const handleSearch = (artistId: string) => {
    setError("");
    setSearchedArtistId(artistId);
  };

  const handleSave = () => {
    if (!editingDetail) return;

    setError("");

    // 準備 mutation 資料格式
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, nationalities, ...detailData } =
      editingDetail;

    updateArtistMutation.mutate(
      {
        detail: detailData,
        nationalities: editingNationalities,
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            alert("儲存成功！");
            // React Query hook 會自動 invalidate 快取並重新載入資料
          } else {
            setError(response.message || "儲存失敗");
          }
        },
        onError: (error) => {
          console.error("儲存藝人資料失敗:", error);
          setError("儲存失敗，請稍後再試");
        },
      }
    );
  };

  const handleCancel = () => {
    if (artistDetail) {
      setEditingDetail(artistDetail);
      setEditingNationalities(artistDetail.nationalities || []);
    } else if (artistBasicInfo) {
      // 重新建立空白明細資料
      const basicInfo: ArtistBasicInfo = artistBasicInfo;
      const emptyDetail: ArtistDetail = {
        id: 0,
        artistId: searchedArtistId,
        stageName: basicInfo.stageName,
        fullName: basicInfo.realName || basicInfo.stageName,
        birthDate: basicInfo.birthDate,
        biologicalGender: "",
        maritalStatus: "",
        bloodTypeABO: "",
        bloodTypeRH: "",
        email: "",
        educationLevel: "",
        incomeLevel: "",
        createdAt: "",
        updatedAt: "",
        nationalities: [],
      };
      setEditingDetail(emptyDetail);
      setEditingNationalities([]);
    } else {
      setEditingDetail(null);
      setEditingNationalities([]);
    }
  };

  const clearError = () => {
    setError("");
  };

  // 根據代號取得選項名稱
  const getOptionName = (
    category: keyof CodeOptionsMap,
    code: string
  ): string => {
    const option = codeOptions[category]?.find((opt) => opt.code === code);
    return option?.name || code;
  };

  // Context 值
  const contextValue: ArtistManagementContextType = {
    // 狀態
    searchedArtistId,
    isQueryLoading,
    editingDetail,
    editingNationalities,
    isSaving,
    error,
    artistBasicInfo,
    codeOptions,

    // 動作
    handleSearch,
    handleSave,
    handleCancel,
    setEditingDetail,
    setEditingNationalities,
    setError,
    clearError,
    getOptionName,
  };

  return (
    <ArtistManagementContext.Provider value={contextValue}>
      {children}
    </ArtistManagementContext.Provider>
  );
}

// 匯出型別以供其他地方使用
export type {
  CodeOptionsMap,
  ArtistManagementState,
  ArtistManagementActions,
  ArtistManagementContextType,
};
