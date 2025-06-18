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
      include: {
        patientDetail: true, // 包含明細資料
      },
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

// 取得所有代號選項
app.get("/api/code-options", async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    let codeOptions;
    if (category) {
      codeOptions = await prisma.codeOption.findMany({
        where: {
          category: category as string,
          isActive: true,
        },
        orderBy: { displayOrder: "asc" },
      });
    } else {
      codeOptions = await prisma.codeOption.findMany({
        where: { isActive: true },
        orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
      });
    }

    res.json({
      success: true,
      data: codeOptions,
    });
  } catch (error) {
    console.error("Error fetching code options:", error);
    res.status(500).json({
      success: false,
      message: "查詢代號選項時發生錯誤",
    });
  }
});

// 取得特定分類的代號選項
app.get("/api/code-options/:category", async (req: Request, res: Response) => {
  try {
    const category = req.params.category;

    const codeOptions = await prisma.codeOption.findMany({
      where: {
        category,
        isActive: true,
      },
      orderBy: { displayOrder: "asc" },
    });

    res.json({
      success: true,
      data: codeOptions,
    });
  } catch (error) {
    console.error("Error fetching code options by category:", error);
    res.status(500).json({
      success: false,
      message: "查詢代號選項時發生錯誤",
    });
  }
});

// 根據病歷號查詢病人明細資料
app.get("/api/patient-detail/:mrn", async (req: Request, res: Response) => {
  try {
    const mrn = req.params.mrn;

    const patientDetail = await prisma.patientDetail.findUnique({
      where: { mrn },
    });

    if (!patientDetail) {
      res.status(404).json({
        success: false,
        message: "找不到病歷號對應的病人明細資料",
      });
      return;
    }

    res.json({
      success: true,
      data: patientDetail,
    });
  } catch (error) {
    console.error("Error fetching patient detail:", error);
    res.status(500).json({
      success: false,
      message: "查詢病人明細資料時發生錯誤",
    });
  }
});

// 新增或更新病人明細資料
app.post("/api/patient-detail", async (req: Request, res: Response) => {
  try {
    const patientDetailData = req.body;

    // 檢查必要欄位
    if (!patientDetailData.mrn) {
      res.status(400).json({
        success: false,
        message: "請提供病歷號",
      });
      return;
    }

    // 檢查對應的基本資料是否存在
    const existingPatientBasic = await prisma.patientBasicInfo.findUnique({
      where: { mrn: patientDetailData.mrn },
    });

    if (!existingPatientBasic) {
      res.status(400).json({
        success: false,
        message: "找不到對應的病人基本資料",
      });
      return;
    }

    // 處理日期格式
    if (patientDetailData.birthDate) {
      patientDetailData.birthDate = new Date(patientDetailData.birthDate);
    }

    // 使用 transaction 來同時更新明細資料和基本檔案
    const result = await prisma.$transaction(async (tx) => {
      // 更新或創建明細資料
      const patientDetail = await tx.patientDetail.upsert({
        where: { mrn: patientDetailData.mrn },
        update: patientDetailData,
        create: patientDetailData,
      });

      // 獲取代號選項來更新基本檔案中的名稱欄位
      const getCodeOptionName = async (category: string, code: string) => {
        if (!code) return '';
        const option = await tx.codeOption.findUnique({
          where: { category_code: { category, code } },
        });
        return option?.name || code;
      };

      // 準備基本檔案更新資料
      const basicInfoUpdate: any = {};

      // 同步更新基本檔案中的相關欄位
      if (patientDetailData.fullName !== undefined) {
        basicInfoUpdate.ptNameFull = patientDetailData.fullName;
      }

      if (patientDetailData.birthDate !== undefined) {
        basicInfoUpdate.birthDate = patientDetailData.birthDate;
      }

      if (patientDetailData.email !== undefined) {
        basicInfoUpdate.email = patientDetailData.email;
      }

      // 更新代號相關欄位
      if (patientDetailData.biologicalGender !== undefined) {
        basicInfoUpdate.gender = patientDetailData.biologicalGender;
        basicInfoUpdate.genderName = await getCodeOptionName('biological_gender', patientDetailData.biologicalGender);
      }

      if (patientDetailData.maritalStatus !== undefined) {
        basicInfoUpdate.maritalStatus = patientDetailData.maritalStatus;
        basicInfoUpdate.maritalStatusName = await getCodeOptionName('marital_status', patientDetailData.maritalStatus);
      }

      if (patientDetailData.educationLevel !== undefined) {
        basicInfoUpdate.educationNo = patientDetailData.educationLevel;
        basicInfoUpdate.educationNoName = await getCodeOptionName('education_level', patientDetailData.educationLevel);
      }

      if (patientDetailData.incomeLevel !== undefined) {
        basicInfoUpdate.lowIncome = patientDetailData.incomeLevel;
        basicInfoUpdate.lowIncomeName = await getCodeOptionName('income_level', patientDetailData.incomeLevel);
      }

      // 更新基本檔案
      if (Object.keys(basicInfoUpdate).length > 0) {
        await tx.patientBasicInfo.update({
          where: { mrn: patientDetailData.mrn },
          data: basicInfoUpdate,
        });
      }

      return patientDetail;
    });

    res.json({
      success: true,
      message: "病人明細資料更新成功，基本檔案已同步更新",
      data: result,
    });
  } catch (error) {
    console.error("Error creating/updating patient detail:", error);
    res.status(500).json({
      success: false,
      message: "處理病人明細資料時發生錯誤",
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
