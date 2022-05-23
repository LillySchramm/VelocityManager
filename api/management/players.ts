import { Player, PrismaClient } from "@prisma/client";

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
