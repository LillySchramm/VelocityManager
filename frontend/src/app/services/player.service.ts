import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../models/player.model';
import { environment } from './../../environments/environment';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import { addMessagesToQueue } from '../store/message/message.actions';
import { Message } from 'primeng/api';

const kickMessage: Message = {
    summary: 'Success',
    detail: 'The kick command has been send successfully.',
    severity: 'success',
};

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private store: Store
    ) {}

    public fetchAllPlayers(): Observable<{ players: Player[] }> {
        return this.http.get<{ players: Player[] }>(
            environment.apiUrl + '/player/all',
            {
                headers: this.authService.generateHeader(),
            }
        );
    }

    public kick(playerId: string, reason: string): void {
        this.http
            .post(
                `${environment.apiUrl}/player/${playerId}/kick`,
                { reason },
                {
                    headers: this.authService.generateHeader(),
                }
            )
            .subscribe(() =>
                this.store.dispatch(
                    addMessagesToQueue({ messages: [kickMessage] })
                )
            );
    }
}
