-- DropForeignKey
ALTER TABLE `Attendance` DROP FOREIGN KEY `Attendance_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
