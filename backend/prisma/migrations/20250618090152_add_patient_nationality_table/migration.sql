-- CreateTable
CREATE TABLE "patient_nationality" (
    "id" SERIAL NOT NULL,
    "mrn" TEXT NOT NULL,
    "nationalityCode" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_nationality_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "patient_nationality" ADD CONSTRAINT "patient_nationality_mrn_fkey" FOREIGN KEY ("mrn") REFERENCES "patient_detail"("mrn") ON DELETE CASCADE ON UPDATE CASCADE;
