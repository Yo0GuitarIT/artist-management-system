import type { ArtistBasicInfo } from "../types/artistBasicInfo";

interface ArtistInfoCardProps {
  artistBasicInfo: ArtistBasicInfo | null;
}

export default function ArtistInfoCard({
  artistBasicInfo,
}: ArtistInfoCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "未提供";
    return new Date(dateString).toLocaleDateString("zh-TW");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        藝人資訊
      </h2>

      {artistBasicInfo ? (
        <div className="space-y-3">
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                藝人編號:
              </span>
              <p className="text-gray-900 dark:text-white font-medium">
                {artistBasicInfo.artistId}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                藝名:
              </span>
              <p className="text-gray-900 dark:text-white">
                {artistBasicInfo.stageName}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                本名:
              </span>
              <p className="text-gray-900 dark:text-white">
                {artistBasicInfo.realName || "未提供"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                出生日期:
              </span>
              <p className="text-gray-900 dark:text-white">
                {formatDate(artistBasicInfo.birthDate)}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                生理性別:
              </span>
              <p className="text-gray-900 dark:text-white">
                {artistBasicInfo.genderName || "未提供"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                婚姻:
              </span>
              <p className="text-gray-900 dark:text-white">
                {artistBasicInfo.maritalStatusName || "未提供"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email:
              </span>
              <p className="text-gray-900 dark:text-white">
                {artistBasicInfo.email || "未提供"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                教育程度:
              </span>
              <p className="text-gray-900 dark:text-white">
                {artistBasicInfo.educationNoName || "未提供"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                低/中收入戶:
              </span>
              <p className="text-gray-900 dark:text-white">
                {artistBasicInfo.lowIncomeName || "未提供"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                國籍:
              </span>
              <p className="text-gray-900 dark:text-white">
                {artistBasicInfo.nationalityCodeName || "未提供"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                主要語言:
              </span>
              <p className="text-gray-900 dark:text-white">
                {artistBasicInfo.mainLangName || "未提供"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                宗教:
              </span>
              <p className="text-gray-900 dark:text-white">
                {artistBasicInfo.religionName || "未提供"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                身分證類型:
              </span>
              <p className="text-gray-900 dark:text-white">
                {artistBasicInfo.idTypeName || "未提供"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                身分證號:
              </span>
              <p className="text-gray-900 dark:text-white">
                {artistBasicInfo.idNo || "未提供"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 dark:text-gray-400 text-center py-8">
          請輸入藝人編號並按下查詢按鈕
        </div>
      )}
    </div>
  );
}
