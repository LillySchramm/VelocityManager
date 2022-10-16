import { Player } from '@prisma/client';

export interface PlayerStatus {
    player: Player;
    online: Boolean;
}

export interface PlayerPing {
    playerIds: string[];
}
