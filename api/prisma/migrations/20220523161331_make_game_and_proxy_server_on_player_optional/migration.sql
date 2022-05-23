-- DropForeignKey
ALTER TABLE `Player` DROP FOREIGN KEY `Player_gameServerId_fkey`;

-- DropForeignKey
ALTER TABLE `Player` DROP FOREIGN KEY `Player_proxyServerId_fkey`;

-- AlterTable
ALTER TABLE `Player` MODIFY `gameServerId` VARCHAR(191) NULL,
    MODIFY `proxyServerId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Player` ADD CONSTRAINT `Player_gameServerId_fkey` FOREIGN KEY (`gameServerId`) REFERENCES `GameServer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Player` ADD CONSTRAINT `Player_proxyServerId_fkey` FOREIGN KEY (`proxyServerId`) REFERENCES `ProxyServer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
