-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "skillName" TEXT NOT NULL,
    "skillLevel" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
