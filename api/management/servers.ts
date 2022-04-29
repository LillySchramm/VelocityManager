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

export async function pingProxyServer(id: string): Promise<boolean> {
    try {
        await prisma.proxyServer.update({ where: { id }, data: { lastContact: Date.now() } })

        return true;
    } catch (e) {
        console.log(e);

        return false;
    }
}

export async function pingGameServer(id: string): Promise<boolean> {
    try {
        await prisma.gameServer.update({ where: { id }, data: { lastContact: Date.now() } })

        return true;
    } catch (e) {
        console.log(e);

        return false;
    }
}

function generateName(): string {
    return uniqueNamesGenerator({ dictionaries: [adjectives, animals, colors] })
}