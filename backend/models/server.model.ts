import { GameServer, ProxyServer } from '@prisma/client';

export enum _SERVER_TYPE {
    GAME_SERVER = 'GAME_SERVER',
    PROXY_SERVER = 'PROXY_SERVER',
}

export type BackendGameServer = GameServer & {
    isOnline?: boolean;
    playerCount?: number;
};

export type BackendProxyServer = ProxyServer & {
    isOnline?: boolean;
};

export type ServerPing = {
    id: string;
    serverType: _SERVER_TYPE;
};
