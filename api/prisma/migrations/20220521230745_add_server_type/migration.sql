-- AlterTable
ALTER TABLE `GameServer` ADD COLUMN `serverTypeId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `ServerType` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `default` BOOLEAN NOT NULL DEFAULT false,
    `deletable` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `ServerType_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert Default

INSERT INTO `ServerType` VALUES ('00000000-0000-0000-0000-000000000001', 'Lobby', true, false);
UPDATE `GameServer` SET `serverTypeId`='00000000-0000-0000-0000-000000000001';

-- AddForeignKey
ALTER TABLE `GameServer` ADD CONSTRAINT `GameServer_serverTypeId_fkey` FOREIGN KEY (`serverTypeId`) REFERENCES `ServerType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
