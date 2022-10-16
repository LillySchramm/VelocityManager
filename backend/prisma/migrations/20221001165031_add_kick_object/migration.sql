-- CreateTable
CREATE TABLE "Kick" (
    "id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "Kick_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Kick" ADD CONSTRAINT "Kick_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
