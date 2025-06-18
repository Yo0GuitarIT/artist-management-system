import { useState, useEffect } from "react";
import { apiService } from "./services/api";
import PatientForm from "./components/PatientForm";
import PatientList from "./components/PatientList";
import type { Patient, PatientFormData } from "./types/patient";

function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<string>("檢查中...");

  // 載入所有病患記錄
  const loadPatients = async () => {
    setLoading(true);
    try {
      const response = await apiService.patients.getAll();
      if (response.success && response.data) {
        setPatients(response.data);
      }
    } catch (error) {
      console.error("載入病患記錄失敗:", error);
      alert("載入病患記錄失敗");
    } finally {
      setLoading(false);
    }
  };

  // 檢查後端連接
  const checkBackendConnection = async () => {
    try {
      const health = await apiService.healthCheck();
      setApiStatus("後端連接正常 ✅");
      console.log("健康檢查:", health);
    } catch (error) {
      console.error("後端連接失敗:", error);
      setApiStatus("後端連接失敗 ❌");
    }
  };

  // 新增病患記錄
  const handleCreatePatient = async (patientData: PatientFormData) => {
    try {
      const response = await apiService.patients.create(patientData);
      if (response.success) {
        await loadPatients(); // 重新載入列表
        setShowForm(false);
        alert("病患記錄新增成功");
      }
    } catch (error) {
      console.error("新增病患記錄失敗:", error);
      alert("新增病患記錄失敗");
    }
  };

  // 更新病患記錄
  const handleUpdatePatient = async (patientData: PatientFormData) => {
    if (!editingPatient) return;

    try {
      const response = await apiService.patients.update(
        editingPatient.id,
        patientData
      );
      if (response.success) {
        await loadPatients(); // 重新載入列表
        setEditingPatient(null);
        setShowForm(false);
        alert("病患記錄更新成功");
      }
    } catch (error) {
      console.error("更新病患記錄失敗:", error);
      alert("更新病患記錄失敗");
    }
  };

  // 刪除病患記錄
  const handleDeletePatient = async (id: number) => {
    if (!confirm("確定要刪除這筆病患記錄嗎？")) return;

    try {
      const response = await apiService.patients.delete(id);
      if (response.success) {
        await loadPatients(); // 重新載入列表
        alert("病患記錄刪除成功");
      }
    } catch (error) {
      console.error("刪除病患記錄失敗:", error);
      alert("刪除病患記錄失敗");
    }
  };

  // 編輯病患記錄
  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  // 取消操作
  const handleCancel = () => {
    setEditingPatient(null);
    setShowForm(false);
  };

  // 提交表單
  const handleFormSubmit = (patientData: PatientFormData) => {
    if (editingPatient) {
      handleUpdatePatient(patientData);
    } else {
      handleCreatePatient(patientData);
    }
  };

  useEffect(() => {
    checkBackendConnection();
    loadPatients();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
          醫療記錄系統 - CRUD 管理
        </h1>

        {/* 系統狀態 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            系統狀態
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            後端狀態: {apiStatus}
          </p>
        </div>

        {/* 操作按鈕 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {showForm ? "隱藏表單" : "新增病患記錄"}
          </button>
          <button
            onClick={loadPatients}
            disabled={loading}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            {loading ? "載入中..." : "重新載入"}
          </button>
        </div>

        {/* 表單區域 */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <PatientForm
              onSubmit={handleFormSubmit}
              initialData={
                editingPatient
                  ? {
                      name: editingPatient.name,
                      age: editingPatient.age,
                      phone: editingPatient.phone,
                      diagnosis: editingPatient.diagnosis,
                    }
                  : undefined
              }
              isEditing={!!editingPatient}
              onCancel={handleCancel}
            />
          </div>
        )}

        {/* 列表區域 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <PatientList
            patients={patients}
            onEdit={handleEditPatient}
            onDelete={handleDeletePatient}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
