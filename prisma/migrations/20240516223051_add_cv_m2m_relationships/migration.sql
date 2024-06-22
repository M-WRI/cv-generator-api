-- CreateTable
CREATE TABLE "CV" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CV_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProfileCVs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EducationCVs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_SkillCVs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LanguageCVs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_WorkExperienceCVs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProfileCVs_AB_unique" ON "_ProfileCVs"("A", "B");

-- CreateIndex
CREATE INDEX "_ProfileCVs_B_index" ON "_ProfileCVs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EducationCVs_AB_unique" ON "_EducationCVs"("A", "B");

-- CreateIndex
CREATE INDEX "_EducationCVs_B_index" ON "_EducationCVs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SkillCVs_AB_unique" ON "_SkillCVs"("A", "B");

-- CreateIndex
CREATE INDEX "_SkillCVs_B_index" ON "_SkillCVs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LanguageCVs_AB_unique" ON "_LanguageCVs"("A", "B");

-- CreateIndex
CREATE INDEX "_LanguageCVs_B_index" ON "_LanguageCVs"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_WorkExperienceCVs_AB_unique" ON "_WorkExperienceCVs"("A", "B");

-- CreateIndex
CREATE INDEX "_WorkExperienceCVs_B_index" ON "_WorkExperienceCVs"("B");

-- AddForeignKey
ALTER TABLE "CV" ADD CONSTRAINT "CV_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileCVs" ADD CONSTRAINT "_ProfileCVs_A_fkey" FOREIGN KEY ("A") REFERENCES "CV"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileCVs" ADD CONSTRAINT "_ProfileCVs_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EducationCVs" ADD CONSTRAINT "_EducationCVs_A_fkey" FOREIGN KEY ("A") REFERENCES "CV"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EducationCVs" ADD CONSTRAINT "_EducationCVs_B_fkey" FOREIGN KEY ("B") REFERENCES "Education"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillCVs" ADD CONSTRAINT "_SkillCVs_A_fkey" FOREIGN KEY ("A") REFERENCES "CV"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillCVs" ADD CONSTRAINT "_SkillCVs_B_fkey" FOREIGN KEY ("B") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LanguageCVs" ADD CONSTRAINT "_LanguageCVs_A_fkey" FOREIGN KEY ("A") REFERENCES "CV"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LanguageCVs" ADD CONSTRAINT "_LanguageCVs_B_fkey" FOREIGN KEY ("B") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkExperienceCVs" ADD CONSTRAINT "_WorkExperienceCVs_A_fkey" FOREIGN KEY ("A") REFERENCES "CV"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkExperienceCVs" ADD CONSTRAINT "_WorkExperienceCVs_B_fkey" FOREIGN KEY ("B") REFERENCES "WorkExperience"("id") ON DELETE CASCADE ON UPDATE CASCADE;
