/*
  Warnings:

  - You are about to drop the column `name` on the `patient_detail` table. All the data in the column will be lost.
  - You are about to drop the column `patientBasicInfoId` on the `patient_detail` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mrn]` on the table `patient_detail` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mrn` to the `patient_detail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "patient_detail" DROP CONSTRAINT "patient_detail_patientBasicInfoId_fkey";

-- DropIndex
DROP INDEX "patient_detail_patientBasicInfoId_key";

-- AlterTable
ALTER TABLE "code_option" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "patient_detail" DROP COLUMN "name",
DROP COLUMN "patientBasicInfoId",
ADD COLUMN     "mrn" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "patient_detail_mrn_key" ON "patient_detail"("mrn");

-- AddForeignKey
ALTER TABLE "patient_detail" ADD CONSTRAINT "patient_detail_mrn_fkey" FOREIGN KEY ("mrn") REFERENCES "patient_basic_info"("mrn") ON DELETE CASCADE ON UPDATE CASCADE;
