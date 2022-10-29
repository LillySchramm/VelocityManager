-- CreateTable
CREATE TABLE "Permisson" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permisson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermissonScope" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermissonScope_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountPermisson" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" VARCHAR(255) NOT NULL,
    "permissonId" TEXT NOT NULL,
    "permissonScopeId" TEXT NOT NULL,

    CONSTRAINT "AccountPermisson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" VARCHAR(255) NOT NULL,
    "name" TEXT NOT NULL,
    "activated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permisson_name_key" ON "Permisson"("name");

-- AddForeignKey
ALTER TABLE "AccountPermisson" ADD CONSTRAINT "AccountPermisson_permissonId_fkey" FOREIGN KEY ("permissonId") REFERENCES "Permisson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountPermisson" ADD CONSTRAINT "AccountPermisson_permissonScopeId_fkey" FOREIGN KEY ("permissonScopeId") REFERENCES "PermissonScope"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountPermisson" ADD CONSTRAINT "AccountPermisson_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
