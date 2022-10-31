/*
  Warnings:

  - You are about to drop the column `aPIKeyId` on the `Permission` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_aPIKeyId_fkey";

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "aPIKeyId";

-- CreateTable
CREATE TABLE "_APIKeyToPermission" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_APIKeyToPermission_AB_unique" ON "_APIKeyToPermission"("A", "B");

-- CreateIndex
CREATE INDEX "_APIKeyToPermission_B_index" ON "_APIKeyToPermission"("B");

-- AddForeignKey
ALTER TABLE "_APIKeyToPermission" ADD CONSTRAINT "_APIKeyToPermission_A_fkey" FOREIGN KEY ("A") REFERENCES "APIKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_APIKeyToPermission" ADD CONSTRAINT "_APIKeyToPermission_B_fkey" FOREIGN KEY ("B") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
