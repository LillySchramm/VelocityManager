export interface PlayerKPIS {
    totalPlayers: number;
    currentPlayers: number;
}

export interface GameServerKPIS {
    totalServers: number;
    currentServers: number;
}

export interface ProxyServerKPIS {
    totalServers: number;
    currentServers: number;
}

export interface KPIS {
    players: PlayerKPIS;
    proxyServer: ProxyServerKPIS;
    gameServer: GameServerKPIS;
}
