-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gameServerId" TEXT,
    "proxyServerId" TEXT,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "deletable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ServerType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameServer" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "lastContact" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT NOT NULL DEFAULT E'',
    "port" INTEGER NOT NULL,
    "maximumPlayers" INTEGER NOT NULL DEFAULT 0,
    "serverTypeId" TEXT NOT NULL,

    CONSTRAINT "GameServer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProxyServer" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "lastContact" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProxyServer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_name_key" ON "Player"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ServerType_name_key" ON "ServerType"("name");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameServerId_fkey" FOREIGN KEY ("gameServerId") REFERENCES "GameServer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_proxyServerId_fkey" FOREIGN KEY ("proxyServerId") REFERENCES "ProxyServer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameServer" ADD CONSTRAINT "GameServer_serverTypeId_fkey" FOREIGN KEY ("serverTypeId") REFERENCES "ServerType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
