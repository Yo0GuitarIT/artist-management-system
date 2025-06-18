-- CreateTable
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_basic_info" (
    "id" SERIAL NOT NULL,
    "mrn" TEXT NOT NULL,
    "ptName" TEXT NOT NULL,
    "ptNameFull" TEXT,
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

    CONSTRAINT "patient_basic_info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patient_basic_info_mrn_key" ON "patient_basic_info"("mrn");
