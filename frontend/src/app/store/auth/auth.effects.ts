import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { exhaustMap, map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { addMessagesToQueue } from '../message/message.actions';
import {
    firstLoginSuccess,
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
    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(login),
            switchMap((payload) =>
                this.authService.login(payload.username, payload.password)
            ),
            map((loginResponse) => {
                if (!loginResponse) {
                    this.store.dispatch(
                        addMessagesToQueue({
                            messages: [
                                {
                                    severity: 'error',
                                    summary: 'Login failed!',
                                    detail: 'Please check username and password',
                                },
                            ],
                        })
                    );
                    return loginFail();
                }

                if (loginResponse.totp) {
                    return firstLoginSuccess({ totp: loginResponse.totp });
                }

                this.store.dispatch(
                    addMessagesToQueue({
                        messages: [
                            {
                                severity: 'success',
                                summary: 'Login successful!',
                            },
                        ],
                    })
                );

                return loginSuccess({ token: loginResponse.bearer || '' });
            })
        )
    );

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(logout),
            map(() => {
                this.authService.logout();

                this.store.dispatch(
                    addMessagesToQueue({
                        messages: [
                            {
                                severity: 'info',
                                summary: 'Logout successful!',
                            },
                        ],
                    })
                );

                return logoutSuccess();
            })
        )
    );
    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private store: Store
    ) {}
}
