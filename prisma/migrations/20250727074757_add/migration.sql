/*
  Warnings:

  - You are about to drop the column `sold` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `sold`;

-- AlterTable
ALTER TABLE `productsize` ADD COLUMN `sold` INTEGER NOT NULL DEFAULT 0;
