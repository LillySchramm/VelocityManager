/*
  Warnings:

  - Added the required column `accountId` to the `APIKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `APIKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `APIKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "APIKey" ADD COLUMN     "accountId" VARCHAR(255) NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" VARCHAR(255) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "aPIKeyId" TEXT;

-- AddForeignKey
ALTER TABLE "APIKey" ADD CONSTRAINT "APIKey_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_aPIKeyId_fkey" FOREIGN KEY ("aPIKeyId") REFERENCES "APIKey"("id") ON DELETE SET NULL ON UPDATE CASCADE;
