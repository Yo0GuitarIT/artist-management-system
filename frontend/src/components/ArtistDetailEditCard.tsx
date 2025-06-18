import type { ArtistDetail, CodeOption } from "../types/artistBasicInfo";

interface CodeOptionsMap {
  biological_gender: CodeOption[];
  marital_status: CodeOption[];
  blood_type_abo: CodeOption[];
  blood_type_rh: CodeOption[];
  education_level: CodeOption[];
  income_level: CodeOption[];
}

interface ArtistDetailEditCardProps {
  editingDetail: ArtistDetail | null;
  artistDetail: ArtistDetail | null;
  codeOptions: CodeOptionsMap;
  onEditingDetailChange: (detail: ArtistDetail) => void;
  getOptionName: (category: keyof CodeOptionsMap, code: string) => string;
}

export default function ArtistDetailEditCard({
  editingDetail,
  artistDetail,
  codeOptions,
  onEditingDetailChange,
  getOptionName,
}: ArtistDetailEditCardProps) {
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          基本資料
        </h2>

        {editingDetail ? (
          <div className="space-y-4">
            {/* 藝名和全名 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  藝名
                </label>
                <input
                  type="text"
                  value={editingDetail.stageName || ""}
                  onChange={(e) =>
                    onEditingDetailChange({
                      ...editingDetail,
                      stageName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  本名
                </label>
                <input
                  type="text"
                  value={editingDetail.fullName || ""}
                  onChange={(e) =>
                    onEditingDetailChange({
                      ...editingDetail,
                      fullName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            {/* 出生日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                出生日期
              </label>
              <input
                type="date"
                value={
                  editingDetail.birthDate
                    ? editingDetail.birthDate.split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  onEditingDetailChange({
                    ...editingDetail,
                    birthDate: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* 生理性別 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                生理性別
              </label>
              <select
                value={editingDetail.biologicalGender || ""}
                onChange={(e) =>
                  onEditingDetailChange({
                    ...editingDetail,
                    biologicalGender: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">請選擇</option>
                {codeOptions.biological_gender.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 婚姻狀況 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                婚姻
              </label>
              <select
                value={editingDetail.maritalStatus || ""}
                onChange={(e) =>
                  onEditingDetailChange({
                    ...editingDetail,
                    maritalStatus: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">請選擇</option>
                {codeOptions.marital_status.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 血型 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  血型
                </label>
                <select
                  value={editingDetail.bloodTypeABO || ""}
                  onChange={(e) =>
                    onEditingDetailChange({
                      ...editingDetail,
                      bloodTypeABO: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">請選擇</option>
                  {codeOptions.blood_type_abo.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  RH
                </label>
                <select
                  value={editingDetail.bloodTypeRH || ""}
                  onChange={(e) =>
                    onEditingDetailChange({
                      ...editingDetail,
                      bloodTypeRH: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">請選擇</option>
                  {codeOptions.blood_type_rh.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editingDetail.email || ""}
                onChange={(e) =>
                  onEditingDetailChange({
                    ...editingDetail,
                    email: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* 教育程度 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                教育程度
              </label>
              <select
                value={editingDetail.educationLevel || ""}
                onChange={(e) =>
                  onEditingDetailChange({
                    ...editingDetail,
                    educationLevel: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">請選擇</option>
                {codeOptions.education_level.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 低/中收入戶 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                低/中收入戶
              </label>
              <select
                value={editingDetail.incomeLevel || ""}
                onChange={(e) =>
                  onEditingDetailChange({
                    ...editingDetail,
                    incomeLevel: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">請選擇</option>
                {codeOptions.income_level.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400 text-center py-8">
            請先查詢病人資料
          </div>
        )}
      </div>

      {/* 顯示模式（僅顯示已儲存的資料） */}
      {artistDetail && !editingDetail && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            已儲存的基本資料
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                生理性別:
              </span>
              <p className="text-gray-900 dark:text-white">
                {getOptionName(
                  "biological_gender",
                  artistDetail.biologicalGender || ""
                )}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                婚姻:
              </span>
              <p className="text-gray-900 dark:text-white">
                {getOptionName(
                  "marital_status",
                  artistDetail.maritalStatus || ""
                )}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                血型:
              </span>
              <p className="text-gray-900 dark:text-white">
                {getOptionName(
                  "blood_type_abo",
                  artistDetail.bloodTypeABO || ""
                )}{" "}
                {getOptionName("blood_type_rh", artistDetail.bloodTypeRH || "")}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                教育程度:
              </span>
              <p className="text-gray-900 dark:text-white">
                {getOptionName(
                  "education_level",
                  artistDetail.educationLevel || ""
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
