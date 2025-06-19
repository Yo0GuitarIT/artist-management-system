-- CreateTable
CREATE TABLE "artist_id_document" (
    "id" SERIAL NOT NULL,
    "artistId" TEXT NOT NULL,
    "idType" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artist_id_document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "artist_id_document" ADD CONSTRAINT "artist_id_document_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist_detail"("artistId") ON DELETE CASCADE ON UPDATE CASCADE;
