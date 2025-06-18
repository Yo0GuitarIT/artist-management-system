-- CreateTable
CREATE TABLE "patient_detail" (
    "id" SERIAL NOT NULL,
    "patientBasicInfoId" INTEGER NOT NULL,
    "name" TEXT,
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

    CONSTRAINT "patient_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "code_option" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayOrder" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "code_option_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patient_detail_patientBasicInfoId_key" ON "patient_detail"("patientBasicInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "code_option_category_code_key" ON "code_option"("category", "code");

-- AddForeignKey
ALTER TABLE "patient_detail" ADD CONSTRAINT "patient_detail_patientBasicInfoId_fkey" FOREIGN KEY ("patientBasicInfoId") REFERENCES "patient_basic_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;
