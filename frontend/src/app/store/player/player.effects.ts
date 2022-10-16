import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { loadAllPlayers, loadAllPlayersSuccess } from './player.actions';
import { PlayerService } from 'src/app/services/player.service';

@Injectable()
export class PlayerEffects {
    loadAllPlayers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadAllPlayers),
            switchMap(() => this.playerService.fetchAllPlayers()),
            map((result) => loadAllPlayersSuccess({ players: result.players }))
        )
    );

    constructor(
        private actions$: Actions,
        private playerService: PlayerService
    ) {}
}
