import { PrismaClient, GameServer, ProxyServer } from '@prisma/client';
import {
    uniqueNamesGenerator,
    adjectives,
    colors,
    animals,
} from 'unique-names-generator';
import { GameServerKPIS, ProxyServerKPIS } from '../models/kpi.model';
import { BackendGameServer, BackendProxyServer } from '../models/server.model';
import { cleanBackendGameServer } from '../tools/cleanup';
import { CONTACT_TIMEOUT_SECONDS } from '../tools/config';

const prisma = new PrismaClient();

const DEFAULT_SERVER_TYPE_ID = '00000000-0000-0000-0000-000000000001';

export function getTTLQuery(): any {
    return {
        lastContact: {
            gte: Date.now() - Number(CONTACT_TIMEOUT_SECONDS),
        },
    };
}

export async function registerGameServer(): Promise<GameServer> {
    const gameServer = await prisma.gameServer.create({
        data: {
            name: generateName(),
            lastContact: 0,
            port: 0,
            serverTypeId: DEFAULT_SERVER_TYPE_ID,
        },
    });

    return gameServer;
}

export async function registerProxyServer(): Promise<ProxyServer> {
    const proxyServer = await prisma.proxyServer.create({
        data: {
            name: generateName(),
            lastContact: 0,
        },
    });

    return proxyServer;
}

export async function pingProxyServer(id: string): Promise<boolean> {
    try {
        await prisma.proxyServer.update({
            where: { id },
            data: { lastContact: Date.now() },
        });

        return true;
    } catch (e) {
        console.log(e);

        return false;
    }
}

export async function updateGameServer(
    id: string,
    ip: string,
    port: number,
    maximumPlayers: number
): Promise<boolean> {
    try {
        await prisma.gameServer.update({
            where: { id },
            data: { lastContact: Date.now(), ip, port, maximumPlayers },
        });

        return true;
    } catch (e) {
        console.log(e);

        return false;
    }
}

export async function pingGameServer(id: string): Promise<boolean> {
    try {
        await prisma.gameServer.update({
            where: { id },
            data: { lastContact: Date.now() },
        });

        return true;
    } catch (e) {
        console.log(e);

        return false;
    }
}

export async function getGameServer(
    id: string
): Promise<BackendGameServer | undefined> {
    try {
        const server = await prisma.gameServer.findFirst({
            where: { id },
            include: { Player: { where: getTTLQuery(), select: { id: true } } },
        });
        if (!server) {
            return undefined;
        }

        const backendServer: BackendGameServer = server;
        backendServer.playerCount = server.Player.length;
        backendServer.isOnline =
            server.lastContact + CONTACT_TIMEOUT_SECONDS >= Date.now();

        return cleanBackendGameServer(backendServer);
    } catch (e) {
        console.log(e);

        return undefined;
    }
}

export async function getProxyServer(
    id: string
): Promise<BackendProxyServer | undefined> {
    try {
        const server: BackendProxyServer | null =
            await prisma.proxyServer.findFirst({ where: { id } });

        if (!server) {
            return undefined;
        }

        server.isOnline =
            server.lastContact + CONTACT_TIMEOUT_SECONDS >= Date.now();

        return server;
    } catch (e) {
        console.log(e);

        return undefined;
    }
}

export async function getAllOnlineProxyServer(): Promise<ProxyServer[]> {
    return await prisma.proxyServer.findMany({
        where: getTTLQuery(),
    });
}

export async function getAllOnlineGameServer(): Promise<BackendGameServer[]> {
    const servers = await prisma.gameServer.findMany({
        where: getTTLQuery(),
        include: { Player: { where: getTTLQuery(), select: { id: true } } },
    });

    const gameServers: BackendGameServer[] = servers.map((server) => {
        const gameServer: BackendGameServer = server;
        gameServer.playerCount = server.Player.length;

        return cleanBackendGameServer(gameServer);
    });

    return gameServers;
}

export async function getJoinableServer(
    requestedServerTypeId: string | undefined
): Promise<GameServer | undefined> {
    const onlineServers = await prisma.gameServer.findMany({
        where: {
            AND: {
                lastContact: {
                    gte: Date.now() - Number(CONTACT_TIMEOUT_SECONDS),
                },
                serverTypeId: requestedServerTypeId,
            },
        },
        include: {
            Player: { where: getTTLQuery() },
        },
        orderBy: {
            Player: {
                _count: 'desc',
            },
        },
    });

    const notFullLobbyServers = onlineServers.filter(
        (server) => server.Player.length !== server.maximumPlayers
    );
    return notFullLobbyServers.shift();
}

export async function isServerFull(serverId: string): Promise<boolean> {
    const server = await prisma.gameServer.findFirst({
        where: { id: serverId },
        include: { Player: { where: getTTLQuery() } },
    });

    return !!server && server?.Player.length >= server?.maximumPlayers;
}

export async function getGameServerKPIs(): Promise<GameServerKPIS> {
    const totalServers = await prisma.gameServer.count({
        where: { lastContact: { not: 0 } },
    });
    const currentServers = await prisma.gameServer.count({
        where: getTTLQuery(),
    });

    return { totalServers, currentServers };
}

export async function getProxyServerKPIs(): Promise<ProxyServerKPIS> {
    const totalServers = await prisma.proxyServer.count({
        where: { lastContact: { not: 0 } },
    });
    const currentServers = await prisma.proxyServer.count({
        where: getTTLQuery(),
    });

    return { totalServers, currentServers };
}

function generateName(): string {
    return uniqueNamesGenerator({
        dictionaries: [adjectives, animals, colors],
    });
}
