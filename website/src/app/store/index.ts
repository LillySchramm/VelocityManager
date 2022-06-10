import {
    ActionReducer,
    ActionReducerMap,
    createFeatureSelector,
    createSelector,
    MetaReducer,
} from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducers';

export interface State {
    auth: AuthState;
}

export const reducers: ActionReducerMap<State> = {
    auth: authReducer,
};

export const metaReducers: MetaReducer<State>[] = [];
