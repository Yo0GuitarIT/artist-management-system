import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import type { ReactNode } from "react";
import type {
  ArtistBasicInfo,
  ArtistDetail,
  ArtistNationality,
  ArtistLanguage,
  ArtistReligion,
  ArtistIdDocument,
} from "../types/artistBasicInfo";
import { useArtistBasicInfo, useCodeOptions } from "../hooks/useArtistQueries";
import { useUpdateArtistDetail } from "../hooks/useArtistMutations";
import {
  ArtistManagementContext,
  type CodeOptionsMap,
  type ArtistManagementContextType,
} from "./ArtistManagementContext";

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
  const [editingLanguages, setEditingLanguages] = useState<ArtistLanguage[]>(
    []
  );
  const [editingReligions, setEditingReligions] = useState<ArtistReligion[]>(
    []
  );
  const [editingIdDocuments, setEditingIdDocuments] = useState<
    ArtistIdDocument[]
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
  const languageQuery = useCodeOptions("language");
  const religionQuery = useCodeOptions("religion");
  const idTypeQuery = useCodeOptions("id_type");

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
      language: languageQuery.data?.data || [],
      religion: religionQuery.data?.data || [],
      id_type: idTypeQuery.data?.data || [],
    }),
    [
      biologicalGenderQuery.data,
      maritalStatusQuery.data,
      bloodTypeABOQuery.data,
      bloodTypeRHQuery.data,
      educationLevelQuery.data,
      incomeLevelQuery.data,
      nationalityQuery.data,
      languageQuery.data,
      religionQuery.data,
      idTypeQuery.data,
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
        setEditingLanguages(basicInfo.artistDetail.languages || []);
        setEditingReligions(basicInfo.artistDetail.religions || []);
        setEditingIdDocuments(basicInfo.artistDetail.idDocuments || []);
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
        setEditingLanguages([]);
        setEditingReligions([]);
        setEditingIdDocuments([]);
      }
    }
  }, [artistQuery.data, searchedArtistId]);

  // 動作函數
  const handleSearch = (artistId: string) => {
    setError("");
    setSearchedArtistId(artistId);
  };

  const handleRefresh = () => {
    if (searchedArtistId) {
      // 重新載入當前藝人的資料
      artistQuery.refetch();
    }
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
        languages: editingLanguages,
        religions: editingReligions,
        idDocuments: editingIdDocuments,
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            toast.success("儲存成功！");
            // React Query hook 會自動 invalidate 快取並重新載入資料
            // 額外確保資料更新
            setTimeout(() => {
              handleRefresh();
            }, 100);
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
      setEditingLanguages(artistDetail.languages || []);
      setEditingReligions(artistDetail.religions || []);
      setEditingIdDocuments(artistDetail.idDocuments || []);
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
      setEditingLanguages([]);
      setEditingReligions([]);
      setEditingIdDocuments([]);
    } else {
      setEditingDetail(null);
      setEditingNationalities([]);
      setEditingLanguages([]);
      setEditingReligions([]);
      setEditingIdDocuments([]);
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
    const option = codeOptions[category]?.find(
      (opt: { code: string; name: string }) => opt.code === code
    );
    return option?.name || code;
  };

  // Context 值
  const contextValue: ArtistManagementContextType = {
    // 狀態
    searchedArtistId,
    isQueryLoading,
    editingDetail,
    editingNationalities,
    editingLanguages,
    editingReligions,
    editingIdDocuments,
    isSaving,
    error,
    artistBasicInfo,
    codeOptions,

    // 動作
    handleSearch,
    handleSave,
    handleCancel,
    handleRefresh,
    setEditingDetail,
    setEditingNationalities,
    setEditingLanguages,
    setEditingReligions,
    setEditingIdDocuments,
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
