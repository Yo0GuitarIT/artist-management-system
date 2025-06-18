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

// 病人基本檔 API 路由

// 根據病歷號查詢病人基本資料
app.get("/api/patient-basic-info/:mrn", async (req: Request, res: Response) => {
  try {
    const mrn = req.params.mrn;

    const patientBasicInfo = await prisma.patientBasicInfo.findUnique({
      where: { mrn },
    });

    if (!patientBasicInfo) {
      res.status(404).json({
        success: false,
        message: "找不到病歷號對應的病人資料",
      });
      return;
    }

    res.json({
      success: true,
      data: patientBasicInfo,
    });
  } catch (error) {
    console.error("Error fetching patient basic info:", error);
    res.status(500).json({
      success: false,
      message: "查詢病人基本資料時發生錯誤",
    });
  }
});

// 新增病人基本資料
app.post("/api/patient-basic-info", async (req: Request, res: Response) => {
  try {
    const patientData = req.body;

    // 檢查必要欄位
    if (!patientData.mrn || !patientData.ptName) {
      res.status(400).json({
        success: false,
        message: "請提供病歷號和病人姓名",
      });
      return;
    }

    // 檢查病歷號是否已存在
    const existingPatient = await prisma.patientBasicInfo.findUnique({
      where: { mrn: patientData.mrn },
    });

    if (existingPatient) {
      res.status(400).json({
        success: false,
        message: "病歷號已存在",
      });
      return;
    }

    // 處理日期格式
    if (patientData.birthDate) {
      patientData.birthDate = new Date(patientData.birthDate);
    }

    const newPatientBasicInfo = await prisma.patientBasicInfo.create({
      data: patientData,
    });

    res.status(201).json({
      success: true,
      message: "病人基本資料新增成功",
      data: newPatientBasicInfo,
    });
  } catch (error) {
    console.error("Error creating patient basic info:", error);
    res.status(500).json({
      success: false,
      message: "新增病人基本資料時發生錯誤",
    });
  }
});

// 更新病人基本資料
app.put("/api/patient-basic-info/:mrn", async (req: Request, res: Response) => {
  try {
    const mrn = req.params.mrn;
    const updateData = req.body;

    // 檢查病人是否存在
    const existingPatient = await prisma.patientBasicInfo.findUnique({
      where: { mrn },
    });

    if (!existingPatient) {
      res.status(404).json({
        success: false,
        message: "找不到病歷號對應的病人資料",
      });
      return;
    }

    // 處理日期格式
    if (updateData.birthDate) {
      updateData.birthDate = new Date(updateData.birthDate);
    }

    const updatedPatientBasicInfo = await prisma.patientBasicInfo.update({
      where: { mrn },
      data: updateData,
    });

    res.json({
      success: true,
      message: "病人基本資料更新成功",
      data: updatedPatientBasicInfo,
    });
  } catch (error) {
    console.error("Error updating patient basic info:", error);
    res.status(500).json({
      success: false,
      message: "更新病人基本資料時發生錯誤",
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
