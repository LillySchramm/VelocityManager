import { Player, PrismaClient } from '@prisma/client';
import { PlayerKPIS } from '../models/kpi.model';
import { PlayerStatus } from '../models/player.model';
import { CONTACT_TIMEOUT, getTTLQuery, isServerFull } from './servers';

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

export async function pingPlayers(playerIds: string[]): Promise<void> {
    if (!playerIds) {
        return;
    }

    await prisma.player.updateMany({
        where: { id: { in: playerIds } },
        data: { lastContact: Date.now() },
    });
}

export async function getPlayers(
    playerIds: string[] = []
): Promise<PlayerStatus[]> {
    const players = await prisma.player.findMany({
        where: playerIds.length ? { id: { in: playerIds } } : {},
    });

    return players.map((player) => {
        return {
            player: player,
            online: player.lastContact > Date.now() - Number(CONTACT_TIMEOUT),
        };
    });
}

export async function getPlayerKPIs(): Promise<PlayerKPIS> {
    const totalPlayers = await prisma.player.count();
    const currentPlayers = await prisma.player.count({ where: getTTLQuery() });

    return { currentPlayers, totalPlayers };
}
