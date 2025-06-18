/*
  Warnings:

  - You are about to drop the `patient_basic_info` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patient_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patient_nationality` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "patient_detail" DROP CONSTRAINT "patient_detail_mrn_fkey";

-- DropForeignKey
ALTER TABLE "patient_nationality" DROP CONSTRAINT "patient_nationality_mrn_fkey";

-- DropTable
DROP TABLE "patient_basic_info";

-- DropTable
DROP TABLE "patient_detail";

-- DropTable
DROP TABLE "patient_nationality";

-- CreateTable
CREATE TABLE "artist_basic_info" (
    "id" SERIAL NOT NULL,
    "artistId" TEXT NOT NULL,
    "stageName" TEXT NOT NULL,
    "realName" TEXT,
    "birthDate" TIMESTAMP(3),
    "gender" TEXT,
    "genderName" TEXT,
    "maritalStatus" TEXT,
    "maritalStatusName" TEXT,
    "email" TEXT,
    "educationNo" TEXT,
    "educationNoName" TEXT,
    "lowIncome" TEXT,
    "lowIncomeName" TEXT,
    "nationalityCode" TEXT,
    "nationalityCodeName" TEXT,
    "mainLang" TEXT,
    "mainLangName" TEXT,
    "religion" TEXT,
    "religionName" TEXT,
    "idType" TEXT,
    "idTypeName" TEXT,
    "idNo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artist_basic_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artist_detail" (
    "id" SERIAL NOT NULL,
    "artistId" TEXT NOT NULL,
    "stageName" TEXT,
    "fullName" TEXT,
    "birthDate" TIMESTAMP(3),
    "biologicalGender" TEXT,
    "maritalStatus" TEXT,
    "bloodTypeABO" TEXT,
    "bloodTypeRH" TEXT,
    "email" TEXT,
    "educationLevel" TEXT,
    "incomeLevel" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artist_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artist_nationality" (
    "id" SERIAL NOT NULL,
    "artistId" TEXT NOT NULL,
    "nationalityCode" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artist_nationality_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "artist_basic_info_artistId_key" ON "artist_basic_info"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "artist_detail_artistId_key" ON "artist_detail"("artistId");

-- AddForeignKey
ALTER TABLE "artist_detail" ADD CONSTRAINT "artist_detail_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist_basic_info"("artistId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_nationality" ADD CONSTRAINT "artist_nationality_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist_detail"("artistId") ON DELETE CASCADE ON UPDATE CASCADE;
