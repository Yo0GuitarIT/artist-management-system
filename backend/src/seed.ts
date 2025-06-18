import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient();

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

    console.log("樣本病人資料已新增：", samplePatient);
  } catch (error) {
    console.error("新增樣本資料時發生錯誤：", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedPatientBasicInfo();
