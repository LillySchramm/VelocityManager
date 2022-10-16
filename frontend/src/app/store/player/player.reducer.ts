import { createReducer, on } from '@ngrx/store';
import { Player } from 'src/app/models/player.model';
import { loadAllPlayers, loadAllPlayersSuccess } from './player.actions';

export interface PlayerState {
    players: Player[];
    loaded: boolean;
}

export const initialState: PlayerState = {
    players: [],
    loaded: false,
};

export const playerReducer = createReducer(
    initialState,
    on(loadAllPlayers, (state) => {
        return { ...state, loaded: false };
    }),
    on(loadAllPlayersSuccess, (state, { players }) => {
        return { ...state, players, loaded: true };
    })
);
