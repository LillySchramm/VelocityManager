import { GameServer, ProxyServer } from '@prisma/client';

export type BackendGameServer = GameServer & {
    isOnline?: boolean;
    playerCount?: number;
};

export type BackendProxyServer = ProxyServer & {
    isOnline?: boolean;
};
