import { createAction, props } from '@ngrx/store';
import { Player } from 'src/app/models/player.model';

export const loadAllPlayers = createAction('[PLAYERS] Loading all players');

export const loadAllPlayersSuccess = createAction(
    '[PLAYERS] Successfully Loaded All Players',
    props<{ players: Player[] }>()
);
