import { ArtistManagementProvider } from "../context";
import ArtistInfoCard from "./ArtistInfoCard";
import BasicInfoCard from "./BasicInfoCard";
import NationalityCard from "./NationalityCard";
import LanguageCard from "./LanguageCard";
import ReligionCard from "./ReligionCard";
import IdDocumentCard from "./IdDocumentCard";
import SearchGroup from "./SearchGroup";

// 主要的管理元件內容
function ArtistManagementContent() {
  return (
    <div className="space-y-6 p-6">
      {/* 搜尋區域 */}
      <SearchGroup />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側：藝人資訊卡片 */}
        <div className="lg:col-span-1">
          <ArtistInfoCard />
        </div>

        {/* 右側：基本資料和其他資料卡片 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本資料卡片 */}
          <BasicInfoCard />

          {/* 國籍資料卡片 */}
          <NationalityCard />

          {/* 語言資料卡片 */}
          <LanguageCard />

          {/* 宗教資料卡片 */}
          <ReligionCard />

          {/* 身份證件資料卡片 */}
          <IdDocumentCard />
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
