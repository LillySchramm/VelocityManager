/*
  Warnings:

  - Added the required column `lastContact` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Server` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Server` ADD COLUMN `lastContact` INTEGER NOT NULL,
    ADD COLUMN `name` VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE `GameServer` (
    `serverId` VARCHAR(191) NOT NULL,
    `port` INTEGER NOT NULL,

    PRIMARY KEY (`serverId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProxyServer` (
    `serverId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`serverId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GameServer` ADD CONSTRAINT `GameServer_serverId_fkey` FOREIGN KEY (`serverId`) REFERENCES `Server`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProxyServer` ADD CONSTRAINT `ProxyServer_serverId_fkey` FOREIGN KEY (`serverId`) REFERENCES `Server`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
