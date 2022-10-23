import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginResponse, PingResponse } from '../models/httpResponses.models';
import { environment } from './../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private idToken = '';

    constructor(
        private http: HttpClient,
        private router: Router,
        private fireauth: AngularFireAuth
    ) {
        this.fireauth.onAuthStateChanged(async (user) => {
            console.log(user);
            if (user) {
                this.idToken = await user.getIdToken();
                return;
            }
            this.idToken = '';
        });
    }

    public isLoggedIn(): Observable<boolean> {
        return this.verifyCredentials(this.idToken);
    }

    public verifyCredentials(credentials: string | null): Observable<boolean> {
        if (!credentials) {
            return of(false);
        }

        return this.http
            .get<PingResponse>(environment.apiUrl + '/ping', {
                headers: this.generateHeader(),
            })
            .pipe(
                map(() => {
                    return true;
                }),
                catchError(() => {
                    return of(false);
                })
            );
    }

    public generateHeader(): { [header: string]: string } {
        return { Authorization: 'Bearer ' + this.idToken };
    }

    public getSavedCredentials(): string | null {
        return localStorage.getItem('credentials');
    }

    public logout(): void {
        this.fireauth.signOut().then(() => this.router.navigate(['login']));
    }

    public login(name: string, otp: string): Observable<LoginResponse | null> {
        return this.http
            .post<LoginResponse>(environment.apiUrl + '/account/login', {
                name,
                otp,
            })
            .pipe(
                map((response) => {
                    if (response.bearer) {
                        localStorage.setItem('credentials', response.bearer);
                    }

                    return response;
                }),
                catchError(() => {
                    return of(null);
                })
            );
    }
}
