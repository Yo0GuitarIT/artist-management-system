import { useArtistManagement } from "../context";

export default function ArtistInfoCard() {
  const {
    artistBasicInfo,
    editingIdDocuments,
    editingNationalities,
    editingLanguages,
    editingReligions,
    codeOptions,
    isSaving,
    handleRefresh,
  } = useArtistManagement();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "未提供";
    return new Date(dateString).toLocaleDateString("zh-TW");
  };

  // 判斷是否正在儲存中
  const isCurrentlySaving = isSaving;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          藝人資訊
        </h2>
        {artistBasicInfo && (
          <button
            onClick={handleRefresh}
            disabled={isCurrentlySaving}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50"
            title="重新載入資料"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}
      </div>

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
              <p className="text-gray-900 dark:text-white font-medium">
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
                性別:
              </span>
              <p className="text-gray-900 dark:text-white">
                {artistBasicInfo.genderName || "未知"}
              </p>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                婚姻狀況:
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
                收入狀況:
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
                {(() => {
                  // 判斷是否有編輯中的國籍資料
                  const originalNationalities =
                    artistBasicInfo.artistDetail?.nationalities || [];
                  const hasEditingNationalities =
                    JSON.stringify(
                      editingNationalities.map((n) => ({
                        id: n.id > 1000000000000 ? null : n.id, // 新增的項目 ID 會很大，視為新增
                        nationalityCode: n.nationalityCode,
                        isPrimary: n.isPrimary,
                      }))
                    ) !==
                    JSON.stringify(
                      originalNationalities.map((n) => ({
                        id: n.id,
                        nationalityCode: n.nationalityCode,
                        isPrimary: n.isPrimary,
                      }))
                    );

                  // 優先使用編輯中的資料
                  const nationalities = hasEditingNationalities
                    ? editingNationalities
                    : originalNationalities;

                  const primaryNationality = nationalities.find(
                    (n) => n.isPrimary
                  );

                  if (primaryNationality) {
                    const nationalityOption = codeOptions.nationality.find(
                      (option) =>
                        option.code === primaryNationality.nationalityCode
                    );
                    return (
                      nationalityOption?.name ||
                      primaryNationality.nationalityCode
                    );
                  }

                  return "未提供";
                })()}
              </p>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                主要語言:
              </span>
              <p className="text-gray-900 dark:text-white">
                {(() => {
                  // 判斷是否有編輯中的語言資料
                  const originalLanguages =
                    artistBasicInfo.artistDetail?.languages || [];
                  const hasEditingLanguages =
                    JSON.stringify(
                      editingLanguages.map((l) => ({
                        id: l.id > 1000000000000 ? null : l.id, // 新增的項目 ID 會很大，視為新增
                        languageCode: l.languageCode,
                        isPrimary: l.isPrimary,
                      }))
                    ) !==
                    JSON.stringify(
                      originalLanguages.map((l) => ({
                        id: l.id,
                        languageCode: l.languageCode,
                        isPrimary: l.isPrimary,
                      }))
                    );

                  // 優先使用編輯中的資料
                  const languages = hasEditingLanguages
                    ? editingLanguages
                    : originalLanguages;

                  const primaryLanguage = languages.find((l) => l.isPrimary);

                  if (primaryLanguage) {
                    const languageOption = codeOptions.language.find(
                      (option) => option.code === primaryLanguage.languageCode
                    );
                    return languageOption?.name || primaryLanguage.languageCode;
                  }

                  return "未提供";
                })()}
              </p>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                宗教:
              </span>
              <p className="text-gray-900 dark:text-white">
                {(() => {
                  // 判斷是否有編輯中的宗教資料
                  const originalReligions =
                    artistBasicInfo.artistDetail?.religions || [];
                  const hasEditingReligions =
                    JSON.stringify(
                      editingReligions.map((r) => ({
                        id: r.id > 1000000000000 ? null : r.id, // 新增的項目 ID 會很大，視為新增
                        religionCode: r.religionCode,
                        isPrimary: r.isPrimary,
                      }))
                    ) !==
                    JSON.stringify(
                      originalReligions.map((r) => ({
                        id: r.id,
                        religionCode: r.religionCode,
                        isPrimary: r.isPrimary,
                      }))
                    );

                  // 優先使用編輯中的資料
                  const religions = hasEditingReligions
                    ? editingReligions
                    : originalReligions;

                  const primaryReligion = religions.find((r) => r.isPrimary);

                  if (primaryReligion) {
                    const religionOption = codeOptions.religion.find(
                      (option) => option.code === primaryReligion.religionCode
                    );
                    return religionOption?.name || primaryReligion.religionCode;
                  }

                  return "未提供";
                })()}
              </p>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                身份證件:
              </span>
              <div>
                {(() => {
                  // 判斷是否有編輯中的身份證件資料
                  const originalIdDocuments =
                    artistBasicInfo.artistDetail?.idDocuments || [];
                  const hasEditingIdDocuments =
                    JSON.stringify(
                      editingIdDocuments.map((doc) => ({
                        id: doc.id > 1000000000000 ? null : doc.id, // 新增的項目 ID 會很大，視為新增
                        idType: doc.idType,
                        idNumber: doc.idNumber,
                        isPrimary: doc.isPrimary,
                      }))
                    ) !==
                    JSON.stringify(
                      originalIdDocuments.map((doc) => ({
                        id: doc.id,
                        idType: doc.idType,
                        idNumber: doc.idNumber,
                        isPrimary: doc.isPrimary,
                      }))
                    );

                  // 優先使用編輯中的資料，如果沒有則使用原始資料
                  const idDocuments = hasEditingIdDocuments
                    ? editingIdDocuments
                    : originalIdDocuments;

                  // 只顯示主要證件
                  const primaryDocument = idDocuments.find(
                    (doc) => doc.isPrimary
                  );

                  if (primaryDocument) {
                    // 根據證件類型顯示對應名稱
                    let typeName = "";
                    switch (primaryDocument.idType) {
                      case "id_card":
                        typeName = "身分證";
                        break;
                      case "passport":
                        typeName = "護照";
                        break;
                      case "health_card":
                        typeName = "健保卡";
                        break;
                      default:
                        typeName = primaryDocument.idType;
                    }

                    return (
                      <p className="text-gray-900 dark:text-white">
                        {typeName}: {primaryDocument.idNumber}
                      </p>
                    );
                  } else {
                    return (
                      <p className="text-gray-900 dark:text-white">未提供</p>
                    );
                  }
                })()}
              </div>
            </div>

            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                建立時間:
              </span>
              <p className="text-gray-900 dark:text-white">
                {formatDate(artistBasicInfo.createdAt)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          請先搜尋藝人資料
        </div>
      )}
    </div>
  );
}
