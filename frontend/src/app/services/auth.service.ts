import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, OnInit, Optional } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppInjector, fireauth } from '../app.module';
import { LoginResponse, PingResponse } from '../models/httpResponses.models';
import { environment } from './../../environments/environment';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService implements OnInit {
    private idToken = '';
    private isFirebaseEnabled = true;

    constructor(
        private http: HttpClient,
        private router: Router,
        private configService: ConfigService
    ) {
        if (fireauth) {
            fireauth.onAuthStateChanged(async (user) => {
                if (user) {
                    this.idToken = await user.getIdToken();
                    return;
                }
                this.idToken = '';
            });
        }
    }

    async ngOnInit(): Promise<void> {
        this.isFirebaseEnabled = (await this.configService.firebase()).projectId!.length > 0;
        console.log((await this.configService.firebase()).projectId)
        if (!this.isFirebaseEnabled) {
            this.idToken = this.getSavedCredentials() || '';
        }
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
                headers: this.generateHeader(credentials),
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

    public generateHeader(idToken?: string): { [header: string]: string } {
        const authMethod = this.isFirebaseEnabled ? 'Bearer' : 'Basic';

        return { Authorization: `${authMethod} ${idToken || this.idToken}` };
    }

    public getSavedCredentials(): string | null {
        return localStorage.getItem('credentials');
    }

    public logout(): void {
        if (fireauth) {
            fireauth.signOut().then(() => this.router.navigate(['login']));
        }
    }

    public login(name: string, password: string): Observable<boolean> {
        const credentials = btoa(`${name}:${password}`)

        return this.verifyCredentials(credentials)
            .pipe(
                map((response) => {
                    if (response) {
                        localStorage.setItem('credentials', credentials);
                        this.idToken = credentials;
                    }

                    return true;
                }),
                catchError(() => {
                    return of(false);
                })
            );
    }
}
