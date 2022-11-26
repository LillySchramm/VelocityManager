import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducers';

export const selectAuth = createFeatureSelector<AuthState>('auth');

export const selectAuthLoaded = createSelector(
    selectAuth,
    (auth) => auth.loaded
);

export const selectIsLoggedIn = createSelector(
    selectAuth,
    (auth) => auth.loggedIn
);
