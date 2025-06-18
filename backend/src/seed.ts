import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient();

async function seedCodeOptions() {
  try {
    // 生理性別選項
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

    // 批量新增所有選項
    const allOptions = [
      ...genderOptions,
      ...maritalOptions,
      ...bloodTypeABOOptions,
      ...bloodTypeRHOptions,
      ...educationOptions,
      ...incomeOptions,
      ...nationalityOptions,
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

async function seedPatientBasicInfo() {
  try {
    // 新增範例病人基本資料
    const samplePatient = await prisma.patientBasicInfo.create({
      data: {
        mrn: "1000000166",
        ptName: "飛龍 <3",
        ptNameFull: "飛龍 <3<3",
        birthDate: new Date("1900-11-29"),
        gender: "0",
        genderName: "未知",
        maritalStatus: "60",
        maritalStatusName: "同居",
        email: "yo012345@gmail.com",
        educationNo: "1",
        educationNoName: "學前教育",
        lowIncome: "01",
        lowIncomeName: "低收入戶",
        nationalityCode: "ATA",
        nationalityCodeName: "南極洲",
        mainLang: "de",
        mainLangName: "德語",
        religion: "03",
        religionName: "道教",
        idType: "04",
        idTypeName: "旅行證",
        idNo: "B1234567899999",
      },
    });

    // 為該病人新增詳細資料
    const samplePatientDetail = await prisma.patientDetail.create({
      data: {
        mrn: "1000000166",
        fullName: "飛龍 <3<3",
        birthDate: new Date("1900-11-29"),
        biologicalGender: "0",
        maritalStatus: "60",
        bloodTypeABO: "AB",
        bloodTypeRH: "U",
        email: "yo012345@gmail.com",
        educationLevel: "1",
        incomeLevel: "01",
      },
    });

    console.log("樣本病人資料已新增：", samplePatient);
    console.log("樣本病人明細資料已新增：", samplePatientDetail);
  } catch (error) {
    console.error("新增樣本資料時發生錯誤：", error);
  }
}

async function main() {
  await seedCodeOptions();
  await seedPatientBasicInfo();
  await prisma.$disconnect();
}

main();
