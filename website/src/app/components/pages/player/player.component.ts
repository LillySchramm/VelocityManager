import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Player } from 'src/app/models/player.model';
import { loadAllPlayers } from 'src/app/store/player/player.actions';
import {
    selectAllPlayers,
    selectPlayersLoaded,
} from 'src/app/store/player/player.selection';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
    public players$: Observable<Player[]>;
    public loading$: Observable<boolean>;

    constructor(private store: Store) {
        this.players$ = store.select(selectAllPlayers);
        this.loading$ = store.select(selectPlayersLoaded);
    }

    ngOnInit(): void {
        this.store.dispatch(loadAllPlayers());
    }
}
