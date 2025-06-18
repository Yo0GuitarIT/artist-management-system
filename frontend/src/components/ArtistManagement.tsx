import { ArtistManagementProvider, useArtistManagement } from "../context";
import ArtistInfoCard from "./ArtistInfoCard";
import ArtistDetailEditCard from "./ArtistDetailEditCard";
import ArtistNationalityCard from "./ArtistNationalityCard";
import ArtistSearchCardWithContext from "./ArtistSearchGroup";

// 主要的管理元件內容
function ArtistManagementContent() {
  const {
    artistBasicInfo,
    editingDetail,
    editingNationalities,
    setEditingDetail,
    setEditingNationalities,
    codeOptions,
    getOptionName,
  } = useArtistManagement();

  return (
    <div className="space-y-6 p-6">
      {/* 搜尋區域 */}
      <ArtistSearchCardWithContext />

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
            artistDetail={artistBasicInfo?.artistDetail || null}
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

                // React Query 的 useDeleteArtistNationality mutation
                // 會自動 invalidateQueries 並重新載入藝人資料
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// 主要的匯出元件，包含 Provider
export default function ArtistManagement() {
  return (
    <ArtistManagementProvider>
      <ArtistManagementContent />
    </ArtistManagementProvider>
  );
}
