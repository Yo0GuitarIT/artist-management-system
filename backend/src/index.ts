import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

// 病患記錄介面
interface Patient {
  id: number;
  name: string;
  age: number;
  phone: string;
  diagnosis: string;
  createdAt: string;
  updatedAt: string;
}

// 模擬資料庫 (記憶體儲存)
let patients: Patient[] = [
  {
    id: 1,
    name: "王小明",
    age: 35,
    phone: "0912345678",
    diagnosis: "高血壓",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "李小華",
    age: 28,
    phone: "0987654321",
    diagnosis: "感冒",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let nextId = 3;

// 中間件
app.use(cors());
app.use(express.json());

// 基本路由
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "醫療記錄系統 API 伺服器運行中" });
});

// 健康檢查
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API 路由
app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "這是測試 API 端點", success: true });
});

// CRUD API 路由

// 取得所有病患記錄 (Read All)
app.get("/api/patients", (req: Request, res: Response) => {
  res.json({
    success: true,
    data: patients,
    total: patients.length,
  });
});

// 取得單一病患記錄 (Read One)
app.get("/api/patients/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const patient = patients.find((p) => p.id === id);

  if (!patient) {
    res.status(404).json({
      success: false,
      message: "找不到病患記錄",
    });
    return;
  }

  res.json({
    success: true,
    data: patient,
  });
});

// 新增病患記錄 (Create)
app.post("/api/patients", (req: Request, res: Response) => {
  const { name, age, phone, diagnosis } = req.body;

  // 簡單驗證
  if (!name || !age || !phone || !diagnosis) {
    res.status(400).json({
      success: false,
      message: "請提供所有必要欄位：姓名、年齡、電話、診斷",
    });
    return;
  }

  const newPatient: Patient = {
    id: nextId++,
    name,
    age: parseInt(age),
    phone,
    diagnosis,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  patients.push(newPatient);

  res.status(201).json({
    success: true,
    message: "病患記錄新增成功",
    data: newPatient,
  });
});

// 更新病患記錄 (Update)
app.put("/api/patients/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name, age, phone, diagnosis } = req.body;

  const patientIndex = patients.findIndex((p) => p.id === id);

  if (patientIndex === -1) {
    res.status(404).json({
      success: false,
      message: "找不到病患記錄",
    });
    return;
  }

  // 更新病患記錄
  patients[patientIndex] = {
    ...patients[patientIndex],
    name: name || patients[patientIndex].name,
    age: age ? parseInt(age) : patients[patientIndex].age,
    phone: phone || patients[patientIndex].phone,
    diagnosis: diagnosis || patients[patientIndex].diagnosis,
    updatedAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    message: "病患記錄更新成功",
    data: patients[patientIndex],
  });
});

// 刪除病患記錄 (Delete)
app.delete("/api/patients/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const patientIndex = patients.findIndex((p) => p.id === id);

  if (patientIndex === -1) {
    res.status(404).json({
      success: false,
      message: "找不到病患記錄",
    });
    return;
  }

  const deletedPatient = patients.splice(patientIndex, 1)[0];

  res.json({
    success: true,
    message: "病患記錄刪除成功",
    data: deletedPatient,
  });
});

app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`);
});
