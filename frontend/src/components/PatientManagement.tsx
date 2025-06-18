import { useState, useEffect, useMemo } from "react";
import type {
  PatientDetail,
  PatientNationality,
  CodeOption,
} from "../types/patientBasicInfo";
import {
  usePatientBasicInfo,
  useCodeOptions,
  useUpdatePatientDetail,
} from "../hooks/usePatientQueries";
import PatientInfoCard from "./PatientInfoCard";
import PatientDetailEditCard from "./PatientDetailEditCard";
import PatientNationalityCard from "./PatientNationalityCard";

interface CodeOptionsMap {
  biological_gender: CodeOption[];
  marital_status: CodeOption[];
  blood_type_abo: CodeOption[];
  blood_type_rh: CodeOption[];
  education_level: CodeOption[];
  income_level: CodeOption[];
  nationality: CodeOption[];
}

export default function PatientManagement() {
  // 搜尋相關狀態
  const [searchMrn, setSearchMrn] = useState<string>("");
  const [searchedMrn, setSearchedMrn] = useState<string>("");
  const [error, setError] = useState<string>("");

  // 編輯表單狀態
  const [editingDetail, setEditingDetail] = useState<PatientDetail | null>(
    null
  );
  const [editingNationalities, setEditingNationalities] = useState<
    PatientNationality[]
  >([]);

  // TanStack Query hooks
  const patientQuery = usePatientBasicInfo(searchedMrn || null);
  const biologicalGenderQuery = useCodeOptions("biological_gender");
  const maritalStatusQuery = useCodeOptions("marital_status");
  const bloodTypeABOQuery = useCodeOptions("blood_type_abo");
  const bloodTypeRHQuery = useCodeOptions("blood_type_rh");
  const educationLevelQuery = useCodeOptions("education_level");
  const incomeLevelQuery = useCodeOptions("income_level");
  const nationalityQuery = useCodeOptions("nationality");

  const updatePatientMutation = useUpdatePatientDetail();

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

  // 當病人資料載入完成時，設置編輯狀態
  useEffect(() => {
    if (patientQuery.data?.success && patientQuery.data.data) {
      const basicInfo = patientQuery.data.data;

      if (basicInfo.patientDetail) {
        // 確保明細資料包含姓名
        const detailWithName = {
          ...basicInfo.patientDetail,
          ptName: basicInfo.patientDetail.ptName || basicInfo.ptName,
        };
        setEditingDetail(detailWithName);
        setEditingNationalities(basicInfo.patientDetail.nationalities || []);
      } else {
        // 建立空白明細資料供編輯
        const emptyDetail: PatientDetail = {
          id: 0,
          mrn: searchedMrn,
          ptName: basicInfo.ptName,
          fullName: basicInfo.ptNameFull || basicInfo.ptName,
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
  }, [patientQuery.data, searchedMrn]);

  // 從查詢中提取資料和狀態
  const patientBasicInfo = patientQuery.data?.success
    ? patientQuery.data.data
    : null;
  const patientDetail = patientBasicInfo?.patientDetail || null;
  const isQueryLoading = patientQuery.isLoading;
  const isSaving = updatePatientMutation.isPending;

  // 搜尋功能
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchMrn.trim()) {
      setError("請輸入病歷號");
      return;
    }

    setError("");
    setSearchedMrn(searchMrn.trim());
  }; // 儲存基本資料
  const handleSave = () => {
    if (!editingDetail) return;

    setError("");

    // 準備 mutation 資料格式
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, nationalities, ...detailData } =
      editingDetail;

    updatePatientMutation.mutate(
      {
        detail: detailData,
        nationalities: editingNationalities,
      },
      {
        onSuccess: (response) => {
          if (response.success && response.data) {
            // 更新本地狀態
            const updatedData = response.data;
            setEditingDetail(updatedData);
            setEditingNationalities(updatedData.nationalities || []);
            alert("儲存成功！");
          } else {
            setError(response.message || "儲存失敗");
          }
        },
        onError: (error) => {
          console.error("儲存病人資料失敗:", error);
          setError("儲存失敗，請稍後再試");
        },
      }
    );
  };

  // 取消編輯
  const handleCancel = () => {
    if (patientDetail) {
      setEditingDetail(patientDetail);
      setEditingNationalities(patientDetail.nationalities || []);
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
                disabled={isQueryLoading}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isQueryLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isQueryLoading ? "查詢中..." : "查詢"}
              </button>
              {editingDetail && (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "儲存中..." : "存檔"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側：病人資訊卡片 */}
        <div className="lg:col-span-1">
          <PatientInfoCard patientBasicInfo={patientBasicInfo || null} />
        </div>

        {/* 右側：基本資料和國籍資料卡片 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本資料卡片 */}
          <PatientDetailEditCard
            editingDetail={editingDetail}
            patientDetail={patientDetail}
            codeOptions={codeOptions}
            onEditingDetailChange={setEditingDetail}
            getOptionName={getOptionName}
          />

          {/* 國籍資料卡片 */}
          {patientBasicInfo && (
            <PatientNationalityCard
              mrn={patientBasicInfo.mrn}
              nationalities={editingNationalities}
              onNationalitiesChange={setEditingNationalities}
              onNationalityDelete={async () => {
                // 刪除成功後重新載入病人基本資料
                if (searchMrn) {
                  handleSearch({ preventDefault: () => {} } as React.FormEvent);
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
