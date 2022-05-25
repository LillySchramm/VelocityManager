import { Player, PrismaClient } from "@prisma/client";
import { isServerFull } from "./servers";

const prisma = new PrismaClient();

export async function upsertPlayer(id: string, name: string): Promise<Player> {
    return await prisma.player.upsert({
        create: {
            id,
            name,
        },
        update: {},
        where: { id },
    });
}

export async function setPlayerGameServer(
    playerId: string,
    gameServerId: string
): Promise<Player | undefined> {
    const serverFull = await isServerFull(gameServerId);
    if (serverFull) {
        return;
    }

    return await prisma.player.update({
        where: {
            id: playerId,
        },
        data: {
            gameServerId,
            lastContact: Date.now(),
        },
    });
}
