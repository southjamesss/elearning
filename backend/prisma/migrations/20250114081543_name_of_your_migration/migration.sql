/*
  Warnings:

  - You are about to drop the `Attendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Exercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Option` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Attendance` DROP FOREIGN KEY `Attendance_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Option` DROP FOREIGN KEY `Option_questionId_fkey`;

-- DropForeignKey
ALTER TABLE `Question` DROP FOREIGN KEY `Question_exerciseId_fkey`;

-- AlterTable
ALTER TABLE `Video` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `Attendance`;

-- DropTable
DROP TABLE `Exercise`;

-- DropTable
DROP TABLE `Option`;

-- DropTable
DROP TABLE `Question`;

-- CreateIndex
CREATE INDEX `Video_userId_fkey` ON `Video`(`userId`);

-- AddForeignKey
ALTER TABLE `Video` ADD CONSTRAINT `Video_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
