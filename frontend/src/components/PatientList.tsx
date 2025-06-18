import React from "react";
import type { Patient } from "../types/patient";

interface PatientListProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

const PatientList: React.FC<PatientListProps> = ({
  patients,
  onEdit,
  onDelete,
  loading = false,
}) => {
  if (loading) {
    return <div className="loading">載入中...</div>;
  }

  if (patients.length === 0) {
    return <div className="no-data">暫無病患記錄</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("zh-TW");
  };

  return (
    <div className="patient-list">
      <h3>病患記錄列表</h3>
      <div className="table-container">
        <table className="patients-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>姓名</th>
              <th>年齡</th>
              <th>電話</th>
              <th>診斷</th>
              <th>建立時間</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.phone}</td>
                <td className="diagnosis-cell">{patient.diagnosis}</td>
                <td className="date-cell">{formatDate(patient.createdAt)}</td>
                <td className="actions-cell">
                  <button
                    onClick={() => onEdit(patient)}
                    className="btn-edit"
                    title="編輯"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => onDelete(patient.id)}
                    className="btn-delete"
                    title="刪除"
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;
