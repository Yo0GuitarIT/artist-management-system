import { useState } from "react";
import { apiService } from "../services/api";
import type { PatientBasicInfo } from "../types/patientBasicInfo";

export default function PatientBasicInfoSearch() {
  const [mrn, setMrn] = useState<string>("");
  const [patientInfo, setPatientInfo] = useState<PatientBasicInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mrn.trim()) {
      setError("請輸入病歷號");
      return;
    }

    setLoading(true);
    setError("");
    setPatientInfo(null);

    try {
      const response = await apiService.patientBasicInfo.getByMrn(mrn.trim());

      if (response.success && response.data) {
        setPatientInfo(response.data);
      } else {
        setError(response.message || "查詢失敗");
      }
    } catch (error) {
      console.error("查詢病人資料失敗:", error);
      setError("查詢病人資料失敗，請檢查網路連線或稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "未提供";
    return new Date(dateString).toLocaleDateString("zh-TW");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          病人基本檔查詢
        </h2>

        {/* 搜尋表單 */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="mrn"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                病歷號
              </label>
              <input
                id="mrn"
                type="text"
                value={mrn}
                onChange={(e) => setMrn(e.target.value)}
                placeholder="請輸入病歷號 (例如: 1000000166)"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={loading}
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? "查詢中..." : "查詢"}
              </button>
            </div>
          </div>
        </form>

        {/* 錯誤訊息 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* 病人資料卡片 */}
        {patientInfo && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                病人資訊
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                病歷號: {patientInfo.mrn}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 基本資料 */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-1">
                  基本資料
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      姓名:
                    </span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {patientInfo.ptName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      全名:
                    </span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {patientInfo.ptNameFull || "未提供"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      出生日期:
                    </span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {formatDate(patientInfo.birthDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      性別:
                    </span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {patientInfo.genderName || "未知"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      婚姻狀況:
                    </span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {patientInfo.maritalStatusName || "未提供"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 聯絡資料 */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-1">
                  聯絡資料
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Email:
                    </span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {patientInfo.email || "未提供"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      教育程度:
                    </span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {patientInfo.educationNoName || "未提供"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      低收入戶:
                    </span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {patientInfo.lowIncomeName || "未提供"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      國籍:
                    </span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {patientInfo.nationalityCodeName || "未提供"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      主要語言:
                    </span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {patientInfo.mainLangName || "未提供"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 其他資料 */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-1">
                  其他資料
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      宗教:
                    </span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {patientInfo.religionName || "未提供"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      身份證類型:
                    </span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {patientInfo.idTypeName || "未提供"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      身份證號:
                    </span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {patientInfo.idNo || "未提供"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      建立時間:
                    </span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {formatDate(patientInfo.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
