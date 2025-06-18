import { useArtistManagement } from "../context";

export default function BasicInfoCard() {
  const { editingDetail, codeOptions, setEditingDetail } =
    useArtistManagement();

  const handleFieldChange = (field: string, value: string) => {
    if (!editingDetail) return;

    setEditingDetail({
      ...editingDetail,
      [field]: value,
    });
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          基本資料
        </h2>

        {editingDetail ? (
          <div className="space-y-4">
            {/* 基本資料區 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 藝名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  藝名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingDetail.stageName || ""}
                  onChange={(e) =>
                    handleFieldChange("stageName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="請輸入藝名"
                />
              </div>

              {/* 本名 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  本名
                </label>
                <input
                  type="text"
                  value={editingDetail.fullName || ""}
                  onChange={(e) =>
                    handleFieldChange("fullName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="請輸入本名"
                />
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
                      ? new Date(editingDetail.birthDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleFieldChange("birthDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editingDetail.email || ""}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="請輸入 Email"
                />
              </div>
            </div>

            {/* 代號選項區 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 生理性別 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  生理性別
                </label>
                <select
                  value={editingDetail.biologicalGender || ""}
                  onChange={(e) =>
                    handleFieldChange("biologicalGender", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">請選擇</option>
                  {codeOptions.biological_gender?.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 婚姻狀況 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  婚姻狀況
                </label>
                <select
                  value={editingDetail.maritalStatus || ""}
                  onChange={(e) =>
                    handleFieldChange("maritalStatus", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">請選擇</option>
                  {codeOptions.marital_status?.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ABO血型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ABO血型
                </label>
                <select
                  value={editingDetail.bloodTypeABO || ""}
                  onChange={(e) =>
                    handleFieldChange("bloodTypeABO", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">請選擇</option>
                  {codeOptions.blood_type_abo?.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* RH血型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  RH血型
                </label>
                <select
                  value={editingDetail.bloodTypeRH || ""}
                  onChange={(e) =>
                    handleFieldChange("bloodTypeRH", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">請選擇</option>
                  {codeOptions.blood_type_rh?.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 教育程度 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  教育程度
                </label>
                <select
                  value={editingDetail.educationLevel || ""}
                  onChange={(e) =>
                    handleFieldChange("educationLevel", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">請選擇</option>
                  {codeOptions.education_level?.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 收入水準 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  收入水準
                </label>
                <select
                  value={editingDetail.incomeLevel || ""}
                  onChange={(e) =>
                    handleFieldChange("incomeLevel", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">請選擇</option>
                  {codeOptions.income_level?.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            請先搜尋藝人資料後進行編輯
          </div>
        )}
      </div>
    </>
  );
}
