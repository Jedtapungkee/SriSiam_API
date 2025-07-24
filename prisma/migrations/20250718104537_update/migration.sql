-- AlterTable
ALTER TABLE `product` ADD COLUMN `educationLevelId` INTEGER NULL,
    ADD COLUMN `gender` ENUM('MALE', 'FEMALE', 'UNISEX') NULL,
    ADD COLUMN `size` ENUM('S', 'M', 'L', 'XL', 'XXL') NULL DEFAULT 'S';

-- CreateTable
CREATE TABLE `EducationLevel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_educationLevelId_fkey` FOREIGN KEY (`educationLevelId`) REFERENCES `EducationLevel`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
