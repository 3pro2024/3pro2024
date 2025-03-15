/*
  Warnings:

  - You are about to drop the column `description` on the `Shuwa` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Shuwa` table. All the data in the column will be lost.
  - You are about to drop the column `youtube` on the `Shuwa` table. All the data in the column will be lost.
  - The `prefecture` column on the `Shuwa` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `class` to the `Shuwa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Shuwa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `howToDo` to the `Shuwa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Shuwa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelSentences` to the `Shuwa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videoUrl` to the `Shuwa` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ShuwaLevel" AS ENUM ('初級', '中級', '上級');

-- CreateEnum
CREATE TYPE "Prefecture" AS ENUM ('北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県', '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県');

-- AlterTable
CREATE SEQUENCE shuwa_id_seq;
ALTER TABLE "Shuwa" DROP COLUMN "description",
DROP COLUMN "username",
DROP COLUMN "youtube",
ADD COLUMN     "class" TEXT NOT NULL,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "howToDo" TEXT NOT NULL,
ADD COLUMN     "level" "ShuwaLevel" NOT NULL,
ADD COLUMN     "modelSentences" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" TEXT,
ADD COLUMN     "videoUrl" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('shuwa_id_seq'),
DROP COLUMN "prefecture",
ADD COLUMN     "prefecture" "Prefecture";
ALTER SEQUENCE shuwa_id_seq OWNED BY "Shuwa"."id";

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "shuwaId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "option1" TEXT NOT NULL,
    "option2" TEXT NOT NULL,
    "option3" TEXT NOT NULL,
    "answerNum" INTEGER NOT NULL,
    "quizVideoUrl" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_shuwaId_key" ON "Quiz"("shuwaId");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_shuwaId_fkey" FOREIGN KEY ("shuwaId") REFERENCES "Shuwa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
