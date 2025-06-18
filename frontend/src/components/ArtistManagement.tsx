import { useState, useEffect, useMemo } from "react";
import type {
  ArtistBasicInfo,
  ArtistDetail,
  ArtistNationality,
  CodeOption,
} from "../types/artistBasicInfo";
import { useArtistBasicInfo, useCodeOptions } from "../hooks/useArtistQueries";
import { useUpdateArtistDetail } from "../hooks/useArtistMutatinons";
import ArtistInfoCard from "./ArtistInfoCard";
import ArtistDetailEditCard from "./ArtistDetailEditCard";
import ArtistNationalityCard from "./ArtistNationalityCard";
import ArtistSearchCard from "./ArtistSearchCard";

interface CodeOptionsMap {
  biological_gender: CodeOption[];
  marital_status: CodeOption[];
  blood_type_abo: CodeOption[];
  blood_type_rh: CodeOption[];
  education_level: CodeOption[];
  income_level: CodeOption[];
  nationality: CodeOption[];
}

export default function ArtistManagement() {
  // 搜尋相關狀態
  const [searchedArtistId, setSearchedArtistId] = useState<string>("");
  const [error, setError] = useState<string>("");

  // 編輯表單狀態
  const [editingDetail, setEditingDetail] = useState<ArtistDetail | null>(null);
  const [editingNationalities, setEditingNationalities] = useState<
    ArtistNationality[]
  >([]);

  // TanStack Query hooks
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

  // 從查詢中提取資料和狀態
  const artistBasicInfo: ArtistBasicInfo | null =
    artistQuery.data?.success && artistQuery.data.data
      ? artistQuery.data.data
      : null;
  const artistDetail = artistBasicInfo?.artistDetail || null;
  const isQueryLoading = artistQuery.isLoading;
  const isSaving = updateArtistMutation.isPending;

  // 搜尋功能
  const handleSearch = (artistId: string) => {
    setError("");
    setSearchedArtistId(artistId);
  }; // 儲存基本資料
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

  // 取消編輯
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
        nationalities: [], // 初始化為空陣列
      };
      setEditingDetail(emptyDetail);
      setEditingNationalities([]);
    } else {
      setEditingDetail(null);
      setEditingNationalities([]);
    }
  };

  // 根據代號取得選項名稱
  const getOptionName = (category: keyof CodeOptionsMap, code: string) => {
    const option = codeOptions[category]?.find((opt) => opt.code === code);
    return option?.name || code;
  };

  return (
    <div className="space-y-6 p-6">
      {/* 搜尋區域 */}
      <ArtistSearchCard
        onSearch={handleSearch}
        onSave={handleSave}
        onCancel={handleCancel}
        isQueryLoading={isQueryLoading}
        isSaving={isSaving}
        error={error}
        showSaveButtons={!!editingDetail}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側：藝人資訊卡片 */}
        <div className="lg:col-span-1">
          <ArtistInfoCard artistBasicInfo={artistBasicInfo || null} />
        </div>

        {/* 右側：基本資料和國籍資料卡片 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本資料卡片 */}
          <ArtistDetailEditCard
            editingDetail={editingDetail}
            artistDetail={artistDetail}
            codeOptions={codeOptions}
            onEditingDetailChange={setEditingDetail}
            getOptionName={getOptionName}
          />

          {/* 國籍資料卡片 */}
          {artistBasicInfo && (
            <ArtistNationalityCard
              artistId={artistBasicInfo.artistId}
              nationalities={editingNationalities}
              onNationalitiesChange={setEditingNationalities}
              onNationalityDelete={async (deletedId) => {
                // 刪除成功後，從本地狀態中移除該國籍
                const updatedNationalities = editingNationalities.filter(
                  (nationality) => nationality.id !== deletedId
                );
                setEditingNationalities(updatedNationalities);

                // 重新載入藝人基本資料以確保資料一致性
                if (searchedArtistId) {
                  // 使用 React Query 的 invalidateQueries 會更高效
                  // handleSearch 會自動被 React Query 觸發
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
