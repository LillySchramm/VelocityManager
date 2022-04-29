-- AlterTable
ALTER TABLE `GameServer` MODIFY `lastContact` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `ProxyServer` MODIFY `lastContact` BIGINT NOT NULL;
