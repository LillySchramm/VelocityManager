import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PingResponse } from '../models/httpResponses.models';
import { environment } from './../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient, private router: Router) {}

    public isLoggedIn(): Observable<boolean> {
        const credentials = this.getSavedCredentials();

        return this.verifyCredentials(credentials);
    }

    public verifyCredentials(credentials: String | null): Observable<boolean> {
        if (!credentials) {
            return of(false);
        }

        return this.http
            .get<PingResponse>(environment.apiUrl + '/ping', {
                headers: this._generateHeader(credentials),
            })
            .pipe(
                map(() => {
                    return true;
                }),
                catchError(() => {
                    localStorage.removeItem('credentials');
                    return of(false);
                })
            );
    }

    public generateHeader(): { [header: string]: string } {
        return { Authorization: 'Basic ' + this.getSavedCredentials() };
    }

    private _generateHeader(credentials: String): { [header: string]: string } {
        return { Authorization: 'Basic ' + credentials };
    }

    public getSavedCredentials(): String | null {
        return localStorage.getItem('credentials');
    }

    public logout(): void {
        localStorage.removeItem('credentials');
        this.router.navigate(['login']);
    }

    public login(
        username: String,
        password: String
    ): Observable<String | null> {
        const credentials = btoa(`${username}:${password}`);

        return this.http
            .get<PingResponse>(environment.apiUrl + '/ping', {
                headers: this._generateHeader(credentials),
            })
            .pipe(
                map(() => {
                    localStorage.setItem('credentials', credentials);
                    return credentials;
                }),
                catchError(() => {
                    return of(null);
                })
            );
    }
}
