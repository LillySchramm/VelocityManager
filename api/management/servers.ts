import { PrismaClient, GameServer, Server, ProxyServer } from "@prisma/client";
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

const prisma = new PrismaClient();

async function createServer(): Promise<Server> {
    const server = await prisma.server.create({
        data: {
            lastContact: 0,
            name: generateName()
        }
    })

    return server;
}

export async function registerGameServer(): Promise<GameServer> {
    const server = await createServer();

    const gameServer = await prisma.gameServer.create({
        data: {
            port: 0,
            serverId: server.id
        }
    })

    return gameServer;
}

export async function registerProxyServer(): Promise<ProxyServer> {
    const server = await createServer();

    const proxyServer = await prisma.proxyServer.create({
        data: {
            serverId: server.id
        }
    })

    return proxyServer;
}

function generateName(): string {
    return uniqueNamesGenerator({dictionaries: [adjectives, animals, colors]})
}