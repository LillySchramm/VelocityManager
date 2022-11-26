import { createReducer, on } from '@ngrx/store';
import {
    loadCredentialsFail,
    loadCredentialsSuccess,
    login,
    loginFail,
    loginSuccess,
    logoutSuccess,
} from './auth.actions';

export interface AuthState {
    totp?: string;
    loggedIn: boolean;
    loaded: boolean;
}

export const initialState: AuthState = {
    loaded: false,
    loggedIn: false
};

export const authReducer = createReducer(
    initialState,
    on(loadCredentialsFail, (state) => {
        return { ...state, loaded: true, loggedIn: false };
    }),
    on(loadCredentialsSuccess, (state, { token }) => {
        return { ...state, token, loaded: true };
    }),
    on(login, (state) => {
        return { ...state, loaded: false };
    }),
    on(loginSuccess, (state) => {
        return { ...state, loaded: true };
    }),
    on(loginFail, (state) => {
        return { ...state, loaded: true, loggedIn: false };
    }),
    on(logoutSuccess, (state) => {
        return { ...state, token: undefined, loggedIn: false };
    })
);
