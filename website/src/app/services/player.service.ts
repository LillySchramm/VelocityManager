import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../models/player.model';
import { environment } from './../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    public fetchAllPlayers(): Observable<{ players: Player[] }> {
        return this.http.get<{ players: Player[] }>(
            environment.apiUrl + '/player/all',
            {
                headers: this.authService.generateHeader(),
            }
        );
    }
}
