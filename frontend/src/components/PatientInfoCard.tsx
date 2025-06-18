import type { PatientBasicInfo } from "../types/patientBasicInfo";

interface PatientInfoCardProps {
  patientBasicInfo: PatientBasicInfo | null;
}

export default function PatientInfoCard({
  patientBasicInfo,
}: PatientInfoCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "未提供";
    return new Date(dateString).toLocaleDateString("zh-TW");
  };

  return (
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
  );
}
