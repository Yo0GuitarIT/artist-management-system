import React, { useState } from "react";
import type { PatientFormData } from "../types/patient";

interface PatientFormProps {
  onSubmit: (data: PatientFormData) => void;
  initialData?: PatientFormData;
  isEditing?: boolean;
  onCancel?: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false,
  onCancel,
}) => {
  const [formData, setFormData] = useState<PatientFormData>(
    initialData || {
      name: "",
      age: "",
      phone: "",
      diagnosis: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="patient-form">
      <h3>{isEditing ? "編輯病患記錄" : "新增病患記錄"}</h3>

      <div className="form-group">
        <label htmlFor="name">姓名:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="age">年齡:</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          min="0"
          max="150"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">電話:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="diagnosis">診斷:</label>
        <textarea
          id="diagnosis"
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          rows={3}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {isEditing ? "更新" : "新增"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            取消
          </button>
        )}
      </div>
    </form>
  );
};

export default PatientForm;
