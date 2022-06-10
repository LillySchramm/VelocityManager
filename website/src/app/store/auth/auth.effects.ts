import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
    catchError,
    exhaustMap,
    map,
    mergeMap,
    switchMap,
    tap,
} from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import {
    loadCredentials,
    loadCredentialsFail,
    loadCredentialsSuccess,
    login,
    loginFail,
    loginSuccess,
    logout,
    logoutSuccess,
} from './auth.actions';

@Injectable()
export class AuthEffects {
    loadCredentials$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadCredentials),
            map(() => this.authService.getSavedCredentials()),
            exhaustMap((token) =>
                this.authService.verifyCredentials(token).pipe(
                    map((valid) => {
                        return valid ? token : null;
                    })
                )
            ),
            map((token) => {
                if (!token) {
                    return loadCredentialsFail();
                }

                return loadCredentialsSuccess({ token });
            })
        )
    );
    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(login),
            switchMap((payload) =>
                this.authService.login(payload.username, payload.password)
            ),
            map((token) => {
                if (!token) {
                    return loginFail();
                }

                return loginSuccess({ token });
            })
        )
    );

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(logout),
            map(() => {
                this.authService.logout();
                return logoutSuccess();
            })
        )
    );
    constructor(private actions$: Actions, private authService: AuthService) {}
}
