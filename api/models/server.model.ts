import { GameServer, ProxyServer } from "@prisma/client";

export type BackendGameServer = GameServer & {
    isOnline?: boolean;
}

export type BackendProxyServer = ProxyServer & {
    isOnline?: boolean;
}