import { useState, useEffect } from "react";
import { apiService } from "./services/api";
import PatientForm from "./components/PatientForm";
import PatientList from "./components/PatientList";
import type { Patient, PatientFormData } from "./types/patient";
import "./App.css";

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
    <div className="app-container">
      <h1>醫療記錄系統 - CRUD 管理</h1>

      <div className="status-section">
        <h2>系統狀態</h2>
        <p>後端狀態: {apiStatus}</p>
      </div>

      <div className="main-content">
        <div className="actions-bar">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? "隱藏表單" : "新增病患記錄"}
          </button>
          <button
            onClick={loadPatients}
            className="btn-secondary"
            disabled={loading}
          >
            {loading ? "載入中..." : "重新載入"}
          </button>
        </div>

        {showForm && (
          <div className="form-section">
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

        <div className="list-section">
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
