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

// 病人基本檔 API 路由

// 根據病歷號查詢病人基本資料
app.get("/api/patient-basic-info/:mrn", async (req: Request, res: Response) => {
  try {
    const mrn = req.params.mrn;

    const patientBasicInfo = await prisma.patientBasicInfo.findUnique({
      where: { mrn },
      include: {
        patientDetail: {
          include: {
            nationalities: true, // 包含國籍資料
          },
        },
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

    // 從 patientDetailData 中排除關聯欄位，只保留 PatientDetail 表的直接欄位
    const { nationalities, ...patientDetailFields } = patientDetailData;

    // 使用 transaction 來同時更新明細資料和基本檔案
    const result = await prisma.$transaction(async (tx) => {
      // 更新或創建明細資料
      const patientDetail = await tx.patientDetail.upsert({
        where: { mrn: patientDetailFields.mrn },
        update: patientDetailFields,
        create: patientDetailFields,
        include: {
          nationalities: true, // 包含國籍資料在回傳結果中
        },
      });

      // 獲取代號選項來更新基本檔案中的名稱欄位
      const getCodeOptionName = async (category: string, code: string) => {
        if (!code) return "";
        const option = await tx.codeOption.findUnique({
          where: { category_code: { category, code } },
        });
        return option?.name || code;
      };

      // 準備基本檔案更新資料
      const basicInfoUpdate: any = {};

      // 同步更新基本檔案中的相關欄位
      if (patientDetailFields.ptName !== undefined) {
        basicInfoUpdate.ptName = patientDetailFields.ptName;
      }

      if (patientDetailFields.fullName !== undefined) {
        basicInfoUpdate.ptNameFull = patientDetailFields.fullName;
      }

      if (patientDetailFields.birthDate !== undefined) {
        basicInfoUpdate.birthDate = patientDetailFields.birthDate;
      }

      if (patientDetailFields.email !== undefined) {
        basicInfoUpdate.email = patientDetailFields.email;
      }

      // 更新代號相關欄位
      if (patientDetailFields.biologicalGender !== undefined) {
        basicInfoUpdate.gender = patientDetailFields.biologicalGender;
        basicInfoUpdate.genderName = await getCodeOptionName(
          "biological_gender",
          patientDetailFields.biologicalGender
        );
      }

      if (patientDetailFields.maritalStatus !== undefined) {
        basicInfoUpdate.maritalStatus = patientDetailFields.maritalStatus;
        basicInfoUpdate.maritalStatusName = await getCodeOptionName(
          "marital_status",
          patientDetailFields.maritalStatus
        );
      }

      if (patientDetailFields.educationLevel !== undefined) {
        basicInfoUpdate.educationNo = patientDetailFields.educationLevel;
        basicInfoUpdate.educationNoName = await getCodeOptionName(
          "education_level",
          patientDetailFields.educationLevel
        );
      }

      if (patientDetailFields.incomeLevel !== undefined) {
        basicInfoUpdate.lowIncome = patientDetailFields.incomeLevel;
        basicInfoUpdate.lowIncomeName = await getCodeOptionName(
          "income_level",
          patientDetailFields.incomeLevel
        );
      }

      // 更新基本檔案
      if (Object.keys(basicInfoUpdate).length > 0) {
        await tx.patientBasicInfo.update({
          where: { mrn: patientDetailFields.mrn },
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

// 國籍資料相關 API

// 取得病人的國籍資料
app.get(
  "/api/patient-nationality/:mrn",
  async (req: Request, res: Response) => {
    try {
      const mrn = req.params.mrn;

      const nationalities = await prisma.patientNationality.findMany({
        where: { mrn },
        orderBy: [
          { isPrimary: "desc" }, // 主要國籍排在前面
          { createdAt: "asc" },
        ],
      });

      res.json({
        success: true,
        data: nationalities,
      });
    } catch (error) {
      console.error("Error fetching patient nationalities:", error);
      res.status(500).json({
        success: false,
        message: "查詢病人國籍資料時發生錯誤",
      });
    }
  }
);

// 新增病人國籍
app.post("/api/patient-nationality", async (req: Request, res: Response) => {
  try {
    const { mrn, nationalityCode } = req.body;

    if (!mrn || !nationalityCode) {
      res.status(400).json({
        success: false,
        message: "請提供病歷號和國籍代碼",
      });
      return;
    }

    // 檢查病人是否存在
    const existingPatient = await prisma.patientDetail.findUnique({
      where: { mrn },
    });

    if (!existingPatient) {
      res.status(400).json({
        success: false,
        message: "找不到對應的病人資料",
      });
      return;
    }

    const newNationality = await prisma.patientNationality.create({
      data: {
        mrn,
        nationalityCode,
        isPrimary: false, // 預設不是主要國籍
      },
    });

    res.status(201).json({
      success: true,
      message: "國籍資料新增成功",
      data: newNationality,
    });
  } catch (error) {
    console.error("Error creating patient nationality:", error);
    res.status(500).json({
      success: false,
      message: "新增國籍資料時發生錯誤",
    });
  }
});

// 更新國籍資料（主要用於設定主要國籍）
app.put("/api/patient-nationality/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { nationalityCode, isPrimary } = req.body;

    const nationality = await prisma.patientNationality.findUnique({
      where: { id },
    });

    if (!nationality) {
      res.status(404).json({
        success: false,
        message: "找不到指定的國籍資料",
      });
      return;
    }

    // 使用 transaction 來處理主要國籍的唯一性
    const result = await prisma.$transaction(async (tx) => {
      // 如果要設定為主要國籍，先將同一病人的其他國籍設為非主要
      if (isPrimary) {
        await tx.patientNationality.updateMany({
          where: {
            mrn: nationality.mrn,
            id: { not: id },
          },
          data: { isPrimary: false },
        });
      }

      // 更新指定的國籍資料
      const updatedNationality = await tx.patientNationality.update({
        where: { id },
        data: {
          nationalityCode: nationalityCode || nationality.nationalityCode,
          isPrimary: isPrimary ?? nationality.isPrimary,
        },
      });

      // 如果設定為主要國籍，同步更新到基本檔案
      if (isPrimary) {
        const codeOption = await tx.codeOption.findUnique({
          where: {
            category_code: {
              category: "nationality",
              code: updatedNationality.nationalityCode,
            },
          },
        });

        await tx.patientBasicInfo.update({
          where: { mrn: nationality.mrn },
          data: {
            nationalityCode: updatedNationality.nationalityCode,
            nationalityCodeName:
              codeOption?.name || updatedNationality.nationalityCode,
          },
        });
      }

      // 如果取消主要國籍且沒有其他主要國籍，清除基本檔案的國籍資料
      if (isPrimary === false) {
        const primaryNationality = await tx.patientNationality.findFirst({
          where: {
            mrn: nationality.mrn,
            isPrimary: true,
          },
        });

        if (!primaryNationality) {
          await tx.patientBasicInfo.update({
            where: { mrn: nationality.mrn },
            data: {
              nationalityCode: null,
              nationalityCodeName: null,
            },
          });
        }
      }

      return updatedNationality;
    });

    res.json({
      success: true,
      message: "國籍資料更新成功",
      data: result,
    });
  } catch (error) {
    console.error("Error updating patient nationality:", error);
    res.status(500).json({
      success: false,
      message: "更新國籍資料時發生錯誤",
    });
  }
});

// 刪除國籍資料
app.delete(
  "/api/patient-nationality/:id",
  async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      const nationality = await prisma.patientNationality.findUnique({
        where: { id },
      });

      if (!nationality) {
        res.status(404).json({
          success: false,
          message: "找不到指定的國籍資料",
        });
        return;
      }

      const wasPrimary = nationality.isPrimary;

      await prisma.$transaction(async (tx) => {
        // 刪除國籍資料
        await tx.patientNationality.delete({
          where: { id },
        });

        // 如果刪除的是主要國籍，清除基本檔案的國籍資料
        if (wasPrimary) {
          await tx.patientBasicInfo.update({
            where: { mrn: nationality.mrn },
            data: {
              nationalityCode: null,
              nationalityCodeName: null,
            },
          });
        }
      });

      res.json({
        success: true,
        message: "國籍資料刪除成功",
      });
    } catch (error) {
      console.error("Error deleting patient nationality:", error);
      res.status(500).json({
        success: false,
        message: "刪除國籍資料時發生錯誤",
      });
    }
  }
);

// 批次處理國籍資料
app.post(
  "/api/patient-nationality/batch",
  async (req: Request, res: Response) => {
    try {
      const { mrn, nationalities } = req.body;

      if (!mrn || !Array.isArray(nationalities)) {
        res.status(400).json({
          success: false,
          message: "請提供有效的病歷號和國籍資料",
        });
        return;
      }

      const result = await prisma.$transaction(async (tx) => {
        // 先刪除該病人的所有現有國籍資料（除了要保留的已存在記錄）
        const existingIds = nationalities
          .filter((n) => n.id && n.id < 1000000000) // 只保留真實的 ID（非臨時 ID）
          .map((n) => n.id);

        await tx.patientNationality.deleteMany({
          where: {
            mrn,
            id: { notIn: existingIds },
          },
        });

        // 處理每一筆國籍資料
        const savedNationalities = [];
        for (const nationality of nationalities) {
          if (nationality.id && nationality.id < 1000000000) {
            // 更新現有記錄
            const updated = await tx.patientNationality.update({
              where: { id: nationality.id },
              data: {
                nationalityCode: nationality.nationalityCode,
                isPrimary: nationality.isPrimary,
              },
            });
            savedNationalities.push(updated);
          } else {
            // 新增記錄
            const created = await tx.patientNationality.create({
              data: {
                mrn,
                nationalityCode: nationality.nationalityCode,
                isPrimary: nationality.isPrimary,
              },
            });
            savedNationalities.push(created);
          }
        }

        // 找出主要國籍並同步到基本檔案
        const primaryNationality = savedNationalities.find((n) => n.isPrimary);

        if (primaryNationality) {
          const codeOption = await tx.codeOption.findUnique({
            where: {
              category_code: {
                category: "nationality",
                code: primaryNationality.nationalityCode,
              },
            },
          });

          await tx.patientBasicInfo.update({
            where: { mrn },
            data: {
              nationalityCode: primaryNationality.nationalityCode,
              nationalityCodeName: codeOption?.name || "",
            },
          });
        } else {
          // 沒有主要國籍，清空基本檔案的國籍資料
          await tx.patientBasicInfo.update({
            where: { mrn },
            data: {
              nationalityCode: null,
              nationalityCodeName: null,
            },
          });
        }

        return savedNationalities;
      });

      res.json({
        success: true,
        message: "國籍資料批次處理成功",
        data: result,
      });
    } catch (error) {
      console.error("Error batch processing patient nationalities:", error);
      res.status(500).json({
        success: false,
        message: "批次處理國籍資料時發生錯誤",
      });
    }
  }
);

// 優雅關閉資料庫連線
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`);
});
