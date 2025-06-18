-- CreateTable
CREATE TABLE "artist_language" (
    "id" SERIAL NOT NULL,
    "artistId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artist_language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artist_religion" (
    "id" SERIAL NOT NULL,
    "artistId" TEXT NOT NULL,
    "religionCode" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artist_religion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "artist_language" ADD CONSTRAINT "artist_language_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist_detail"("artistId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_religion" ADD CONSTRAINT "artist_religion_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist_detail"("artistId") ON DELETE CASCADE ON UPDATE CASCADE;
