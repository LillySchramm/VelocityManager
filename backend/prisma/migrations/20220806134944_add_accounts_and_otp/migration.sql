-- CreateTable
CREATE TABLE "APIKey" (
    "id" TEXT NOT NULL,
    "key" VARCHAR(255) NOT NULL,

    CONSTRAINT "APIKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "initialSecretId" TEXT,
    "oTPId" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InitialSecret" (
    "id" TEXT NOT NULL,
    "key" VARCHAR(6) NOT NULL,

    CONSTRAINT "InitialSecret_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OTP" (
    "id" TEXT NOT NULL,
    "dataUri" VARCHAR(255) NOT NULL,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_initialSecretId_fkey" FOREIGN KEY ("initialSecretId") REFERENCES "InitialSecret"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_oTPId_fkey" FOREIGN KEY ("oTPId") REFERENCES "OTP"("id") ON DELETE SET NULL ON UPDATE CASCADE;
