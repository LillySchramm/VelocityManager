import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { addMessagesToQueue } from '../message/message.actions';
import {
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

                console.log("dhjsakhdsajkdhskajhdkjashdkjas")

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

                return loginSuccess();
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
