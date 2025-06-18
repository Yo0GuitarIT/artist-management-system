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
  res.json({ message: "藝人經紀管理系統 API 伺服器運行中" });
});

// 健康檢查
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 藝人基本檔 API 路由

// 根據藝人編號查詢藝人基本資料
app.get(
  "/api/artist-basic-info/:artistId",
  async (req: Request, res: Response) => {
    try {
      const artistId = req.params.artistId;

      const artistBasicInfo = await prisma.artistBasicInfo.findUnique({
        where: { artistId: artistId },
        include: {
          artistDetail: {
            include: {
              nationalities: true, // 包含國籍資料
            },
          },
        },
      });

      if (!artistBasicInfo) {
        res.status(404).json({
          success: false,
          message: "找不到藝人編號對應的藝人資料",
        });
        return;
      }

      res.json({
        success: true,
        data: artistBasicInfo,
      });
    } catch (error) {
      console.error("Error fetching artist basic info:", error);
      res.status(500).json({
        success: false,
        message: "查詢藝人基本資料時發生錯誤",
      });
    }
  }
);

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

// 新增或更新藝人明細資料
app.post("/api/artist-detail", async (req: Request, res: Response) => {
  try {
    const artistDetailData = req.body;

    // 檢查必要欄位
    if (!artistDetailData.artistId) {
      res.status(400).json({
        success: false,
        message: "請提供藝人編號",
      });
      return;
    }

    // 檢查對應的基本資料是否存在
    const existingArtistBasic = await prisma.artistBasicInfo.findUnique({
      where: { artistId: artistDetailData.artistId },
    });

    if (!existingArtistBasic) {
      res.status(400).json({
        success: false,
        message: "找不到對應的藝人基本資料",
      });
      return;
    }

    // 處理日期格式
    if (artistDetailData.birthDate) {
      artistDetailData.birthDate = new Date(artistDetailData.birthDate);
    }

    // 從 artistDetailData 中排除關聯欄位，只保留 ArtistDetail 表的直接欄位
    const { nationalities, ...artistDetailFields } = artistDetailData;

    // 使用 transaction 來同時更新明細資料、國籍資料和基本檔案
    const result = await prisma.$transaction(async (tx) => {
      // 更新或創建明細資料
      const artistDetail = await tx.artistDetail.upsert({
        where: { artistId: artistDetailFields.artistId },
        update: artistDetailFields,
        create: artistDetailFields,
        include: {
          nationalities: true, // 包含國籍資料在回傳結果中
        },
      });

      // 處理國籍資料（如果有提供）
      let savedNationalities = artistDetail.nationalities;
      if (nationalities && Array.isArray(nationalities)) {
        // 先刪除該藝人的所有現有國籍資料（除了要保留的已存在記錄）
        const existingIds = nationalities
          .filter((n: any) => n.id && n.id < 1000000000) // 只保留真實的 ID（非臨時 ID）
          .map((n: any) => n.id);

        await tx.artistNationality.deleteMany({
          where: {
            artistId: artistDetailFields.artistId,
            id: { notIn: existingIds },
          },
        });

        // 處理每一筆國籍資料
        savedNationalities = [];
        for (const nationality of nationalities) {
          if (nationality.id && nationality.id < 1000000000) {
            // 更新現有記錄
            const updated = await tx.artistNationality.update({
              where: { id: nationality.id },
              data: {
                nationalityCode: nationality.nationalityCode,
                isPrimary: nationality.isPrimary,
              },
            });
            savedNationalities.push(updated);
          } else {
            // 新增記錄
            const created = await tx.artistNationality.create({
              data: {
                artistId: artistDetailFields.artistId,
                nationalityCode: nationality.nationalityCode,
                isPrimary: nationality.isPrimary,
              },
            });
            savedNationalities.push(created);
          }
        }
      }

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
      if (artistDetailFields.stageName !== undefined) {
        basicInfoUpdate.stageName = artistDetailFields.stageName;
      }

      if (artistDetailFields.fullName !== undefined) {
        basicInfoUpdate.realName = artistDetailFields.fullName;
      }

      if (artistDetailFields.birthDate !== undefined) {
        basicInfoUpdate.birthDate = artistDetailFields.birthDate;
      }

      if (artistDetailFields.email !== undefined) {
        basicInfoUpdate.email = artistDetailFields.email;
      }

      // 更新代號相關欄位
      if (artistDetailFields.biologicalGender !== undefined) {
        basicInfoUpdate.gender = artistDetailFields.biologicalGender;
        basicInfoUpdate.genderName = await getCodeOptionName(
          "biological_gender",
          artistDetailFields.biologicalGender
        );
      }

      if (artistDetailFields.maritalStatus !== undefined) {
        basicInfoUpdate.maritalStatus = artistDetailFields.maritalStatus;
        basicInfoUpdate.maritalStatusName = await getCodeOptionName(
          "marital_status",
          artistDetailFields.maritalStatus
        );
      }

      if (artistDetailFields.educationLevel !== undefined) {
        basicInfoUpdate.educationNo = artistDetailFields.educationLevel;
        basicInfoUpdate.educationNoName = await getCodeOptionName(
          "education_level",
          artistDetailFields.educationLevel
        );
      }

      if (artistDetailFields.incomeLevel !== undefined) {
        basicInfoUpdate.lowIncome = artistDetailFields.incomeLevel;
        basicInfoUpdate.lowIncomeName = await getCodeOptionName(
          "income_level",
          artistDetailFields.incomeLevel
        );
      }

      // 處理國籍資料同步到基本檔案
      if (savedNationalities && savedNationalities.length > 0) {
        const primaryNationality = savedNationalities.find(
          (n: any) => n.isPrimary
        );

        if (primaryNationality) {
          basicInfoUpdate.nationalityCode = primaryNationality.nationalityCode;
          basicInfoUpdate.nationalityCodeName = await getCodeOptionName(
            "nationality",
            primaryNationality.nationalityCode
          );
        } else {
          // 沒有主要國籍，清空基本檔案的國籍資料
          basicInfoUpdate.nationalityCode = null;
          basicInfoUpdate.nationalityCodeName = null;
        }
      } else if (nationalities !== undefined) {
        // 如果明確傳入空陣列，清空基本檔案的國籍資料
        basicInfoUpdate.nationalityCode = null;
        basicInfoUpdate.nationalityCodeName = null;
      }

      // 更新基本檔案
      if (Object.keys(basicInfoUpdate).length > 0) {
        await tx.artistBasicInfo.update({
          where: { artistId: artistDetailFields.artistId },
          data: basicInfoUpdate,
        });
      }

      // 回傳更新後的明細資料，包含最新的國籍資料
      return {
        ...artistDetail,
        nationalities: savedNationalities,
      };
    });

    res.json({
      success: true,
      message: "藝人明細資料更新成功，基本檔案已同步更新",
      data: result,
    });
  } catch (error) {
    console.error("Error creating/updating artist detail:", error);
    res.status(500).json({
      success: false,
      message: "處理藝人明細資料時發生錯誤",
    });
  }
});

// 國籍資料相關 API (僅保留刪除功能)

// 刪除藝人國籍
app.delete(
  "/api/artist-nationality/:id",
  async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);

      const nationality = await prisma.artistNationality.findUnique({
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
        await tx.artistNationality.delete({
          where: { id },
        });

        // 如果刪除的是主要國籍，清除基本檔案的國籍資料
        if (wasPrimary) {
          await tx.artistBasicInfo.update({
            where: { artistId: nationality.artistId },
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
      console.error("Error deleting artist nationality:", error);
      res.status(500).json({
        success: false,
        message: "刪除國籍資料時發生錯誤",
      });
    }
  }
);

// 優雅關閉資料庫連線
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

app.listen(PORT, () => {
  console.log(`藝人經紀管理系統 API 伺服器運行在 http://localhost:${PORT}`);
});
