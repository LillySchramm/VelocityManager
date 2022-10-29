/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InitialSecret` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OTP` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_initialSecretId_fkey";

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_oTPId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_accountId_fkey";

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "InitialSecret";

-- DropTable
DROP TABLE "OTP";

-- DropTable
DROP TABLE "Session";
