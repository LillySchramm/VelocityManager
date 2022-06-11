import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducers';
import { kpiReducer, KpiState } from './kpi/kpi.reducer';
import { messageReducer, MessageState } from './message/message.reducers';

export interface State {
    auth: AuthState;
    messages: MessageState;
    kpi: KpiState;
}

export const reducers: ActionReducerMap<State> = {
    auth: authReducer,
    messages: messageReducer,
    kpi: kpiReducer,
};

export const metaReducers: MetaReducer<State>[] = [];
