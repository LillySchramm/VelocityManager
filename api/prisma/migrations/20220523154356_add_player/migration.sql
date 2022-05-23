-- CreateTable
CREATE TABLE `Player` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `gameServerId` VARCHAR(191) NOT NULL,
    `proxyServerId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Player` ADD CONSTRAINT `Player_gameServerId_fkey` FOREIGN KEY (`gameServerId`) REFERENCES `GameServer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Player` ADD CONSTRAINT `Player_proxyServerId_fkey` FOREIGN KEY (`proxyServerId`) REFERENCES `ProxyServer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
