import { BackendGameServer } from '../models/server.model';

export function cleanBackendGameServer(
    backendServer: BackendGameServer
): BackendGameServer {
    return {
        createdAt: backendServer.createdAt,
        id: backendServer.id,
        ip: backendServer.ip,
        lastContact: backendServer.lastContact,
        maximumPlayers: backendServer.maximumPlayers,
        name: backendServer.name,
        port: backendServer.port,
        serverTypeId: backendServer.serverTypeId,
        isOnline: backendServer.isOnline,
        playerCount: backendServer.playerCount,
    };
}
