import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "./generated/prisma";

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

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
app.get("/api/patients", async (req: Request, res: Response) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: patients,
      total: patients.length,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({
      success: false,
      message: "取得病患記錄時發生錯誤",
    });
  }
});

// 取得單一病患記錄 (Read One)
app.get("/api/patients/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const patient = await prisma.patient.findUnique({
      where: { id },
    });

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
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({
      success: false,
      message: "取得病患記錄時發生錯誤",
    });
  }
});

// 新增病患記錄 (Create)
app.post("/api/patients", async (req: Request, res: Response) => {
  try {
    const { name, age, phone, diagnosis } = req.body;

    // 簡單驗證
    if (!name || !age || !phone || !diagnosis) {
      res.status(400).json({
        success: false,
        message: "請提供所有必要欄位：姓名、年齡、電話、診斷",
      });
      return;
    }

    const newPatient = await prisma.patient.create({
      data: {
        name,
        age: parseInt(age),
        phone,
        diagnosis,
      },
    });

    res.status(201).json({
      success: true,
      message: "病患記錄新增成功",
      data: newPatient,
    });
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({
      success: false,
      message: "新增病患記錄時發生錯誤",
    });
  }
});

// 更新病患記錄 (Update)
app.put("/api/patients/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, age, phone, diagnosis } = req.body;

    // 檢查病患是否存在
    const existingPatient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!existingPatient) {
      res.status(404).json({
        success: false,
        message: "找不到病患記錄",
      });
      return;
    }

    // 更新病患記錄
    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: {
        name: name || existingPatient.name,
        age: age ? parseInt(age) : existingPatient.age,
        phone: phone || existingPatient.phone,
        diagnosis: diagnosis || existingPatient.diagnosis,
      },
    });

    res.json({
      success: true,
      message: "病患記錄更新成功",
      data: updatedPatient,
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({
      success: false,
      message: "更新病患記錄時發生錯誤",
    });
  }
});

// 刪除病患記錄 (Delete)
app.delete("/api/patients/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    // 檢查病患是否存在
    const existingPatient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!existingPatient) {
      res.status(404).json({
        success: false,
        message: "找不到病患記錄",
      });
      return;
    }

    const deletedPatient = await prisma.patient.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "病患記錄刪除成功",
      data: deletedPatient,
    });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({
      success: false,
      message: "刪除病患記錄時發生錯誤",
    });
  }
});

// 優雅關閉資料庫連線
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`);
});
