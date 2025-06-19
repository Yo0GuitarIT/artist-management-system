import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient();

async function seedCodeOptions() {
  try {
    // 性別選項
    const genderOptions = [
      { category: "biological_gender", code: "1", name: "男", displayOrder: 1 },
      { category: "biological_gender", code: "2", name: "女", displayOrder: 2 },
      {
        category: "biological_gender",
        code: "0",
        name: "未知",
        displayOrder: 3,
      },
      {
        category: "biological_gender",
        code: "9",
        name: "未說明性別",
        displayOrder: 4,
      },
    ];

    // 婚姻狀況選項
    const maritalOptions = [
      { category: "marital_status", code: "10", name: "已婚", displayOrder: 1 },
      { category: "marital_status", code: "20", name: "未婚", displayOrder: 2 },
      { category: "marital_status", code: "30", name: "喪偶", displayOrder: 3 },
      { category: "marital_status", code: "40", name: "離婚", displayOrder: 4 },
      { category: "marital_status", code: "50", name: "分居", displayOrder: 5 },
      { category: "marital_status", code: "60", name: "同居", displayOrder: 6 },
      {
        category: "marital_status",
        code: "70",
        name: "拒絕透露",
        displayOrder: 7,
      },
      {
        category: "marital_status",
        code: "99",
        name: "未說明",
        displayOrder: 8,
      },
    ];

    // ABO血型選項
    const bloodTypeABOOptions = [
      { category: "blood_type_abo", code: "A", name: "A型", displayOrder: 1 },
      { category: "blood_type_abo", code: "B", name: "B型", displayOrder: 2 },
      { category: "blood_type_abo", code: "O", name: "O型", displayOrder: 3 },
      { category: "blood_type_abo", code: "AB", name: "AB型", displayOrder: 4 },
      { category: "blood_type_abo", code: "U", name: "不詳", displayOrder: 5 },
      { category: "blood_type_abo", code: "N", name: "未查", displayOrder: 6 },
    ];

    // RH血型選項
    const bloodTypeRHOptions = [
      { category: "blood_type_rh", code: "N", name: "RH陰性", displayOrder: 1 },
      { category: "blood_type_rh", code: "P", name: "RH陽性", displayOrder: 2 },
      { category: "blood_type_rh", code: "U", name: "不詳", displayOrder: 3 },
      { category: "blood_type_rh", code: "X", name: "未查", displayOrder: 4 },
    ];

    // 教育程度選項
    const educationOptions = [
      {
        category: "education_level",
        code: "1",
        name: "學前教育",
        displayOrder: 1,
      },
      {
        category: "education_level",
        code: "2",
        name: "國民小學",
        displayOrder: 2,
      },
      {
        category: "education_level",
        code: "3",
        name: "國民中學",
        displayOrder: 3,
      },
      {
        category: "education_level",
        code: "4",
        name: "高級中等",
        displayOrder: 4,
      },
      { category: "education_level", code: "5", name: "專科", displayOrder: 5 },
      { category: "education_level", code: "6", name: "學士", displayOrder: 6 },
      { category: "education_level", code: "7", name: "碩士", displayOrder: 7 },
      { category: "education_level", code: "8", name: "博士", displayOrder: 8 },
    ];

    // 低/中收入戶選項
    const incomeOptions = [
      {
        category: "income_level",
        code: "01",
        name: "低收入戶",
        displayOrder: 1,
      },
      {
        category: "income_level",
        code: "02",
        name: "中低收入戶",
        displayOrder: 2,
      },
    ];

    // 國籍選項
    const nationalityOptions = [
      {
        category: "nationality",
        code: "ATA",
        name: "南極洲",
        displayOrder: 1,
      },
      {
        category: "nationality",
        code: "JPN",
        name: "日本",
        displayOrder: 2,
      },
      {
        category: "nationality",
        code: "TWN",
        name: "台灣",
        displayOrder: 3,
      },
      {
        category: "nationality",
        code: "KOR",
        name: "韓國",
        displayOrder: 4,
      },
      {
        category: "nationality",
        code: "USA",
        name: "美國",
        displayOrder: 5,
      },
      {
        category: "nationality",
        code: "CAN",
        name: "加拿大",
        displayOrder: 6,
      },
      {
        category: "nationality",
        code: "BEL",
        name: "比利時",
        displayOrder: 7,
      },
    ];

    // 語言選項
    const languageOptions = [
      { category: "language", code: "zh", name: "中文", displayOrder: 1 },
      { category: "language", code: "en", name: "英文", displayOrder: 2 },
      { category: "language", code: "ja", name: "日文", displayOrder: 3 },
      { category: "language", code: "es", name: "西班牙文", displayOrder: 4 },
      { category: "language", code: "ko", name: "韓文", displayOrder: 5 },
      { category: "language", code: "other", name: "其他", displayOrder: 6 },
    ];

    // 宗教選項
    const religionOptions = [
      { category: "religion", code: "buddhism", name: "佛教", displayOrder: 1 },
      { category: "religion", code: "taoism", name: "道教", displayOrder: 2 },
      {
        category: "religion",
        code: "catholic",
        name: "天主教",
        displayOrder: 3,
      },
      {
        category: "religion",
        code: "christian",
        name: "基督教",
        displayOrder: 4,
      },
      {
        category: "religion",
        code: "islam",
        name: "伊斯蘭教",
        displayOrder: 5,
      },
      { category: "religion", code: "other", name: "其他", displayOrder: 6 },
    ];

    // 身份證件類型選項
    const idTypeOptions = [
      { category: "id_type", code: "id_card", name: "身分證", displayOrder: 1 },
      { category: "id_type", code: "passport", name: "護照", displayOrder: 2 },
      {
        category: "id_type",
        code: "health_card",
        name: "健保卡",
        displayOrder: 3,
      },
    ];

    // 批量新增所有選項
    const allOptions = [
      ...genderOptions,
      ...maritalOptions,
      ...bloodTypeABOOptions,
      ...bloodTypeRHOptions,
      ...educationOptions,
      ...incomeOptions,
      ...nationalityOptions,
      ...languageOptions,
      ...religionOptions,
      ...idTypeOptions,
    ];

    for (const option of allOptions) {
      await prisma.codeOption.upsert({
        where: {
          category_code: {
            category: option.category,
            code: option.code,
          },
        },
        update: {
          name: option.name,
          displayOrder: option.displayOrder,
        },
        create: option,
      });
    }

    console.log("代號選項資料已初始化完成");
  } catch (error) {
    console.error("初始化代號選項時發生錯誤：", error);
  }
}

async function seedArtistBasicInfo() {
  try {
    // 新增範例藝人基本資料
    const sampleArtist = await prisma.artistBasicInfo.create({
      data: {
        artistId: "ART001",
        stageName: "小雨",
        realName: "王小雨",
        birthDate: new Date("1995-03-15"),
        gender: "2",
        genderName: "女",
        maritalStatus: "20",
        maritalStatusName: "未婚",
        email: "xiaoyuwang@gmail.com",
        educationNo: "5",
        educationNoName: "大學",
        lowIncome: "00",
        lowIncomeName: "一般戶",
        nationalityCode: "TWN",
        nationalityCodeName: "台灣",
        mainLang: "zh",
        mainLangName: "中文",
        religion: "buddhism",
        religionName: "佛教",
        idType: "id_card",
        idTypeName: "身分證",
        idNo: "A123456789",
      },
    });

    // 為該藝人新增詳細資料
    const sampleArtistDetail = await prisma.artistDetail.create({
      data: {
        artistId: "ART001",
        stageName: "小雨",
        fullName: "王小雨",
        birthDate: new Date("1995-03-15"),
        biologicalGender: "2",
        maritalStatus: "20",
        bloodTypeABO: "O",
        bloodTypeRH: "P",
        email: "xiaoyuwang@gmail.com",
        educationLevel: "5",
        incomeLevel: "00",
      },
    });

    // 新增第二個藝人
    const sampleArtist2 = await prisma.artistBasicInfo.create({
      data: {
        artistId: "ART002",
        stageName: "阿明",
        realName: "陳明輝",
        birthDate: new Date("1992-07-22"),
        gender: "1",
        genderName: "男",
        maritalStatus: "10",
        maritalStatusName: "已婚",
        email: "mingchen@gmail.com",
        educationNo: "6",
        educationNoName: "研究所",
        lowIncome: "00",
        lowIncomeName: "一般戶",
        nationalityCode: "TWN",
        nationalityCodeName: "台灣",
        mainLang: "zh",
        mainLangName: "中文",
        religion: "catholic",
        religionName: "天主教",
        idType: "passport",
        idTypeName: "護照",
        idNo: "B987654321",
      },
    });

    console.log("樣本藝人資料已新增：", sampleArtist);
    console.log("樣本藝人明細資料已新增：", sampleArtistDetail);
    console.log("第二個樣本藝人資料已新增：", sampleArtist2);

    // 新增範例身份證件資料
    const sampleIdDocuments = await Promise.all([
      // 為第一個藝人新增身份證件
      prisma.artistIdDocument.create({
        data: {
          artistId: "ART001",
          idType: "id_card",
          idNumber: "A123456789",
          isPrimary: true,
        },
      }),
      prisma.artistIdDocument.create({
        data: {
          artistId: "ART001",
          idType: "health_card",
          idNumber: "3253123145211123456",
          isPrimary: false,
        },
      }),
      // 為第二個藝人新增身份證件
      prisma.artistIdDocument.create({
        data: {
          artistId: "ART002",
          idType: "passport",
          idNumber: "32531234562",
          isPrimary: true,
        },
      }),
    ]);

    console.log("範例身份證件資料已新增：", sampleIdDocuments);
  } catch (error) {
    console.error("新增樣本資料時發生錯誤：", error);
  }
}

async function main() {
  await seedCodeOptions();
  await seedArtistBasicInfo();
  await prisma.$disconnect();
}

main();
