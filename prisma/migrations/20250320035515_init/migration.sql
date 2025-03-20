/*
  Warnings:

  - You are about to drop the column `answerNum` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `option1` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `option2` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `option3` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `class` on the `Shuwa` table. All the data in the column will be lost.
  - Added the required column `answerIndex` to the `Quiz` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Shuwa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade` to the `Shuwa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "answerNum",
DROP COLUMN "option1",
DROP COLUMN "option2",
DROP COLUMN "option3",
ADD COLUMN     "answerIndex" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Shuwa" DROP COLUMN "class",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "grade" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Option" (
    "id" SERIAL NOT NULL,
    "quizId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" TEXT,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Option_quizId_key" ON "Option"("quizId");

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
