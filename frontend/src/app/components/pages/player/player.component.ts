import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { Player } from 'src/app/models/player.model';
import { PlayerService } from 'src/app/services/player.service';
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

    public kickDialogVisible = false;
    public playerToBeKicked?: Player;
    public kickReason = '';

    constructor(private store: Store, private playerService: PlayerService) {
        this.players$ = store.select(selectAllPlayers);
        this.loading$ = store.select(selectPlayersLoaded);
    }

    playerItems(player: Player): MenuItem[] {
        return [
            {
                label: 'Kick',
                icon: 'pi pi-times-circle',
                command: () => {
                    this.playerToBeKicked = player;
                    this.kickReason = '';
                    this.kickDialogVisible = true;
                },
            },
        ];
    }

    kickPlayer(playerId: string, reason: string) {
        this.playerService.kick(playerId, reason);
    }

    ngOnInit(): void {
        this.store.dispatch(loadAllPlayers());
    }
}
