import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducers';

export const selectAuth = createFeatureSelector<AuthState>('auth');

export const selectAuthToken = createSelector(selectAuth, (auth) => auth.token);

export const selectAuthLoaded = createSelector(
    selectAuth,
    (auth) => auth.loaded
);
