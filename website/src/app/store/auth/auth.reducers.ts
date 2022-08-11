import { createReducer, on } from '@ngrx/store';
import {
    firstLoginSuccess,
    loadCredentials,
    loadCredentialsFail,
    loadCredentialsSuccess,
    login,
    loginFail,
    loginSuccess,
    logout,
    logoutSuccess,
    unloadTOTP,
} from './auth.actions';

export interface AuthState {
    token?: string;
    totp?: string;
    loaded: boolean;
}

export const initialState: AuthState = {
    loaded: false,
};

export const authReducer = createReducer(
    initialState,
    on(loadCredentials, (state) => {
        return { ...state, loaded: false };
    }),
    on(loadCredentialsFail, (state) => {
        return { ...state, loaded: true };
    }),
    on(loadCredentialsSuccess, (state, { token }) => {
        return { ...state, token, loaded: true };
    }),
    on(login, (state) => {
        return { ...state, loaded: false };
    }),
    on(firstLoginSuccess, (state, { totp }) => {
        return { ...state, totp, loaded: true };
    }),
    on(unloadTOTP, (state) => {
        return { ...state, totp: undefined, loaded: true };
    }),
    on(loginSuccess, (state, { token }) => {
        return { ...state, token, loaded: true };
    }),
    on(loginFail, (state) => {
        return { ...state, loaded: true };
    }),
    on(logoutSuccess, (state) => {
        return { ...state, token: undefined };
    })
);
