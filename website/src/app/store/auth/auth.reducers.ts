import { createReducer, on } from '@ngrx/store';
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

export interface AuthState {
    token?: String;
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
