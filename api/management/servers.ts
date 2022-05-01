import { PrismaClient, GameServer, ProxyServer } from "@prisma/client";
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import { BackendGameServer, BackendProxyServer } from "../models/server.model";

const prisma = new PrismaClient();

const CONTACT_TIMEOUT = BigInt(10 * 1000);

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

export async function getGameServer(id: string): Promise<BackendGameServer | undefined> {
    try {
        const server: BackendGameServer | null = await prisma.gameServer.findFirst({ where: { id } })

        if (!server) {
            return undefined;
        }

        server.isOnline = server.lastContact + CONTACT_TIMEOUT >= Date.now();

        return server;
    } catch (e) {
        console.log(e);

        return undefined;
    }
}

export async function getProxyServer(id: string): Promise<BackendProxyServer | undefined> {
    try {
        const server: BackendProxyServer | null = await prisma.gameServer.findFirst({ where: { id } })

        if (!server) {
            return undefined;
        }

        server.isOnline = server.lastContact + CONTACT_TIMEOUT >= Date.now();

        return server;
    } catch (e) {
        console.log(e);

        return undefined;
    }
}

export async function getAllOnlineProxyServer(): Promise<ProxyServer[]> {
    return await prisma.proxyServer.findMany({
        where: {
            lastContact: {
                gte: Date.now() - Number(CONTACT_TIMEOUT)
            }
        }
    })
}

export async function getAllOnlineGameServer(): Promise<GameServer[]> {
    return await prisma.gameServer.findMany({
        where: {
            lastContact: {
                gte: Date.now() - Number(CONTACT_TIMEOUT)
            }
        }
    })
}

function generateName(): string {
    return uniqueNamesGenerator({ dictionaries: [adjectives, animals, colors] })
}