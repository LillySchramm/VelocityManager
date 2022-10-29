/*
  Warnings:

  - You are about to drop the `AccountPermisson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permisson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PermissonScope` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AccountPermisson" DROP CONSTRAINT "AccountPermisson_accountId_fkey";

-- DropForeignKey
ALTER TABLE "AccountPermisson" DROP CONSTRAINT "AccountPermisson_permissonId_fkey";

-- DropForeignKey
ALTER TABLE "AccountPermisson" DROP CONSTRAINT "AccountPermisson_permissonScopeId_fkey";

-- DropTable
DROP TABLE "AccountPermisson";

-- DropTable
DROP TABLE "Permisson";

-- DropTable
DROP TABLE "PermissonScope";

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissionScope" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermissionScope_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountPermission" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" VARCHAR(255) NOT NULL,
    "permissionId" TEXT NOT NULL,
    "permissionScopeId" TEXT NOT NULL,

    CONSTRAINT "AccountPermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- AddForeignKey
ALTER TABLE "AccountPermission" ADD CONSTRAINT "AccountPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountPermission" ADD CONSTRAINT "AccountPermission_permissionScopeId_fkey" FOREIGN KEY ("permissionScopeId") REFERENCES "PermissionScope"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountPermission" ADD CONSTRAINT "AccountPermission_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
