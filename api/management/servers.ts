import { PrismaClient, GameServer, ProxyServer } from "@prisma/client";
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

const prisma = new PrismaClient();

export async function registerGameServer(): Promise<GameServer> {
    const gameServer = await prisma.gameServer.create({
        data: {
            name: generateName(),
            lastContact: 0,
            port: 0
        }
    })

    return gameServer;
}

export async function registerProxyServer(): Promise<ProxyServer> {
    const proxyServer = await prisma.proxyServer.create({
        data: {
            name: generateName(),
            lastContact: 0,
        }
    })

    return proxyServer;
}

function generateName(): string {
    return uniqueNamesGenerator({dictionaries: [adjectives, animals, colors]})
}