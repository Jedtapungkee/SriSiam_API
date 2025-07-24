/*
  Warnings:

  - You are about to drop the column `price` on the `product` table. All the data in the column will be lost.
  - Added the required column `price` to the `ProductSize` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `price`;

-- AlterTable
ALTER TABLE `productsize` ADD COLUMN `price` DOUBLE NOT NULL;
