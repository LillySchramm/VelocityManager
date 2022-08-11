import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducers';

export const selectAuth = createFeatureSelector<AuthState>('auth');

export const selectAuthToken = createSelector(selectAuth, (auth) => auth.token);
export const selectTOTP = createSelector(selectAuth, (auth) => auth.totp);

export const selectAuthLoaded = createSelector(
    selectAuth,
    (auth) => auth.loaded
);

export const selectIsLoggedIn = createSelector(
    selectAuth,
    (auth) => !!auth.token && auth.token !== ''
);
