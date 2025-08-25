-- AlterTable
ALTER TABLE `productoncart` MODIFY `size` ENUM('S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'SIZE_36', 'SIZE_37', 'SIZE_38', 'SIZE_39', 'SIZE_40', 'SIZE_41', 'SIZE_42', 'SIZE_43', 'SIZE_44', 'SIZE_45') NULL;

-- AlterTable
ALTER TABLE `productonorder` MODIFY `size` ENUM('S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'SIZE_36', 'SIZE_37', 'SIZE_38', 'SIZE_39', 'SIZE_40', 'SIZE_41', 'SIZE_42', 'SIZE_43', 'SIZE_44', 'SIZE_45') NULL;

-- AlterTable
ALTER TABLE `productsize` MODIFY `size` ENUM('S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'SIZE_36', 'SIZE_37', 'SIZE_38', 'SIZE_39', 'SIZE_40', 'SIZE_41', 'SIZE_42', 'SIZE_43', 'SIZE_44', 'SIZE_45') NOT NULL;

-- CreateTable
CREATE TABLE `ResetPasswordToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `otp` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ResetPasswordToken` ADD CONSTRAINT `ResetPasswordToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
