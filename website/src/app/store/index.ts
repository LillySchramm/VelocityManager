import {
    ActionReducer,
    ActionReducerMap,
    createFeatureSelector,
    createSelector,
    MetaReducer,
} from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducers';
import { messageReducer, MessageState } from './message/message.reducers';

export interface State {
    auth: AuthState;
    messages: MessageState;
}

export const reducers: ActionReducerMap<State> = {
    auth: authReducer,
    messages: messageReducer,
};

export const metaReducers: MetaReducer<State>[] = [];
