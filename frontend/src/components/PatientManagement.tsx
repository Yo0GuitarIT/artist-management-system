import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import type {
  PatientBasicInfo,
  PatientDetail,
  CodeOption,
} from "../types/patientBasicInfo";
import PatientInfoCard from "./PatientInfoCard";
import PatientDetailEditCard from "./PatientDetailEditCard";

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
          // 確保明細資料包含姓名
          const detailWithName = {
            ...basicResponse.data.patientDetail,
            ptName:
              basicResponse.data.patientDetail.ptName ||
              basicResponse.data.ptName,
          };
          setEditingDetail(detailWithName);
        } else {
          // 建立空白明細資料供編輯
          const emptyDetail: PatientDetail = {
            id: 0,
            mrn: searchMrn.trim(),
            ptName: basicResponse.data.ptName, // 包含姓名
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
    } else if (patientBasicInfo) {
      // 重新建立空白明細資料
      const emptyDetail: PatientDetail = {
        id: 0,
        mrn: searchMrn,
        ptName: patientBasicInfo.ptName,
        fullName: patientBasicInfo.ptNameFull || patientBasicInfo.ptName,
        birthDate: patientBasicInfo.birthDate,
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
    } else {
      setEditingDetail(null);
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
        <PatientInfoCard patientBasicInfo={patientBasicInfo} />

        {/* 基本資料卡片 */}
        <PatientDetailEditCard
          editingDetail={editingDetail}
          patientDetail={patientDetail}
          codeOptions={codeOptions}
          onEditingDetailChange={setEditingDetail}
          getOptionName={getOptionName}
        />
      </div>
    </div>
  );
}
