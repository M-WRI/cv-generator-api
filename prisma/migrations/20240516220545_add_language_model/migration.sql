-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "language" TEXT NOT NULL,
    "languageLevel" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Language" ADD CONSTRAINT "Language_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
