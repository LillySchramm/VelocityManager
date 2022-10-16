import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerState } from './player.reducer';

export const selectPlayers = createFeatureSelector<PlayerState>('player');

export const selectAllPlayers = createSelector(
    selectPlayers,
    (state) => state.players
);

export const selectPlayersLoaded = createSelector(
    selectPlayers,
    (state) => state.loaded
);
