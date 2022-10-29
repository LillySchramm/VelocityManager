-- DropForeignKey
ALTER TABLE "AccountPermission" DROP CONSTRAINT "AccountPermission_permissionScopeId_fkey";

-- AlterTable
ALTER TABLE "AccountPermission" ALTER COLUMN "permissionScopeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AccountPermission" ADD CONSTRAINT "AccountPermission_permissionScopeId_fkey" FOREIGN KEY ("permissionScopeId") REFERENCES "PermissionScope"("id") ON DELETE SET NULL ON UPDATE CASCADE;
