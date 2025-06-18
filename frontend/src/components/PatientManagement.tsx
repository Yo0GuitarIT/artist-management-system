import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import type {
  PatientBasicInfo,
  PatientDetail,
  CodeOption,
} from "../types/patientBasicInfo";

interface CodeOptionsMap {
  biological_gender: CodeOption[];
  marital_status: CodeOption[];
  blood_type_abo: CodeOption[];
  blood_type_rh: CodeOption[];
  education_level: CodeOption[];
  income_level: CodeOption[];
}

export default function PatientManagement() {
  // 搜尋相關狀態
  const [searchMrn, setSearchMrn] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // 病人資料狀態
  const [patientBasicInfo, setPatientBasicInfo] =
    useState<PatientBasicInfo | null>(null);
  const [patientDetail, setPatientDetail] = useState<PatientDetail | null>(
    null
  );

  // 編輯表單狀態
  const [editingDetail, setEditingDetail] = useState<PatientDetail | null>(
    null
  );

  // 代號選項
  const [codeOptions, setCodeOptions] = useState<CodeOptionsMap>({
    biological_gender: [],
    marital_status: [],
    blood_type_abo: [],
    blood_type_rh: [],
    education_level: [],
    income_level: [],
  });

  // 載入代號選項
  useEffect(() => {
    const loadCodeOptions = async () => {
      try {
        const categories = [
          "biological_gender",
          "marital_status",
          "blood_type_abo",
          "blood_type_rh",
          "education_level",
          "income_level",
        ];

        const optionsMap: Partial<CodeOptionsMap> = {};

        for (const category of categories) {
          const response = await apiService.codeOptions.getByCategory(category);
          if (response.success && response.data) {
            optionsMap[category as keyof CodeOptionsMap] = response.data;
          }
        }

        setCodeOptions(optionsMap as CodeOptionsMap);
      } catch (error) {
        console.error("載入代號選項失敗:", error);
      }
    };

    loadCodeOptions();
  }, []);

  // 搜尋功能
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchMrn.trim()) {
      setError("請輸入病歷號");
      return;
    }

    setLoading(true);
    setError("");
    setPatientBasicInfo(null);
    setPatientDetail(null);
    setEditingDetail(null);

    try {
      // 查詢病人基本資料（包含明細資料）
      const basicResponse = await apiService.patientBasicInfo.getByMrn(
        searchMrn.trim()
      );

      if (basicResponse.success && basicResponse.data) {
        setPatientBasicInfo(basicResponse.data);

        // 如果有明細資料則設定，否則建立空白明細資料
        if (basicResponse.data.patientDetail) {
          setPatientDetail(basicResponse.data.patientDetail);
          setEditingDetail(basicResponse.data.patientDetail);
        } else {
          // 建立空白明細資料供編輯
          const emptyDetail: PatientDetail = {
            id: 0,
            mrn: searchMrn.trim(),
            fullName:
              basicResponse.data.ptNameFull || basicResponse.data.ptName,
            birthDate: basicResponse.data.birthDate,
            biologicalGender: "",
            maritalStatus: "",
            bloodTypeABO: "",
            bloodTypeRH: "",
            email: "",
            educationLevel: "",
            incomeLevel: "",
            createdAt: "",
            updatedAt: "",
          };
          setEditingDetail(emptyDetail);
        }
      } else {
        setError(basicResponse.message || "查詢失敗");
      }
    } catch (error) {
      console.error("查詢病人資料失敗:", error);
      setError("查詢病人資料失敗，請檢查網路連線或稍後再試");
    } finally {
      setLoading(false);
    }
  };

  // 儲存基本資料
  const handleSave = async () => {
    if (!editingDetail) return;

    setLoading(true);
    setError("");

    try {
      const response = await apiService.patientDetail.createOrUpdate(
        editingDetail
      );

      if (response.success && response.data) {
        setPatientDetail(response.data);
        setEditingDetail(response.data);

        // 重新查詢病人資料以刷新顯示
        const basicResponse = await apiService.patientBasicInfo.getByMrn(
          searchMrn
        );
        if (basicResponse.success && basicResponse.data) {
          setPatientBasicInfo(basicResponse.data);
        }

        alert("儲存成功！");
      } else {
        setError(response.message || "儲存失敗");
      }
    } catch (error) {
      console.error("儲存病人明細資料失敗:", error);
      setError("儲存失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  // 取消編輯
  const handleCancel = () => {
    if (patientDetail) {
      setEditingDetail(patientDetail);
    } else {
      setEditingDetail(null);
    }
  };

  // 格式化日期
  const formatDate = (dateString?: string) => {
    if (!dateString) return "未提供";
    return new Date(dateString).toLocaleDateString("zh-TW");
  };

  // 根據代號取得選項名稱
  const getOptionName = (category: keyof CodeOptionsMap, code: string) => {
    const option = codeOptions[category]?.find((opt) => opt.code === code);
    return option?.name || code;
  };

  return (
    <div className="space-y-6 p-6">
      {/* 搜尋區域 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          病人資料管理系統
        </h1>

        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label
                htmlFor="mrn"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                病歷號
              </label>
              <input
                type="text"
                id="mrn"
                value={searchMrn}
                onChange={(e) => setSearchMrn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="請輸入病歷號"
                disabled={loading}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "查詢中..." : "查詢"}
              </button>
              {editingDetail && (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "儲存中..." : "存檔"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    取消
                  </button>
                </>
              )}
            </div>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <div className="text-red-800">{error}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 病人資訊卡片 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            病人資訊
          </h2>

          {patientBasicInfo ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    病歷號:
                  </span>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {patientBasicInfo.mrn}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    姓名:
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {patientBasicInfo.ptName}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    全名:
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {patientBasicInfo.ptNameFull || "未提供"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    出生日期:
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {formatDate(patientBasicInfo.birthDate)}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    生理性別:
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {patientBasicInfo.genderName || "未提供"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    婚姻:
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {patientBasicInfo.maritalStatusName || "未提供"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email:
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {patientBasicInfo.email || "未提供"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    教育程度:
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {patientBasicInfo.educationNoName || "未提供"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    低/中收入戶:
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {patientBasicInfo.lowIncomeName || "未提供"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    國籍:
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {patientBasicInfo.nationalityCodeName || "未提供"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    主要語言:
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {patientBasicInfo.mainLangName || "未提供"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    宗教:
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {patientBasicInfo.religionName || "未提供"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    身分證類型:
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {patientBasicInfo.idTypeName || "未提供"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    身分證號:
                  </span>
                  <p className="text-gray-900 dark:text-white">
                    {patientBasicInfo.idNo || "未提供"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400 text-center py-8">
              請輸入病歷號並按下查詢按鈕
            </div>
          )}
        </div>

        {/* 基本資料卡片 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            基本資料
          </h2>

          {editingDetail ? (
            <div className="space-y-4">
              {/* 姓名和全名 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    姓名
                  </label>
                  <input
                    type="text"
                    value={patientBasicInfo?.ptName || ""}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-600 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    全名
                  </label>
                  <input
                    type="text"
                    value={editingDetail.fullName || ""}
                    onChange={(e) =>
                      setEditingDetail({
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
                    setEditingDetail({
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
                    setEditingDetail({
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
                    setEditingDetail({
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
                      setEditingDetail({
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
                      setEditingDetail({
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
                    setEditingDetail({
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
                    setEditingDetail({
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
                    setEditingDetail({
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
      </div>

      {/* 顯示模式（僅顯示已儲存的資料） */}
      {patientDetail && !editingDetail && (
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
                  patientDetail.biologicalGender || ""
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
                  patientDetail.maritalStatus || ""
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
                  patientDetail.bloodTypeABO || ""
                )}{" "}
                {getOptionName(
                  "blood_type_rh",
                  patientDetail.bloodTypeRH || ""
                )}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                教育程度:
              </span>
              <p className="text-gray-900 dark:text-white">
                {getOptionName(
                  "education_level",
                  patientDetail.educationLevel || ""
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
