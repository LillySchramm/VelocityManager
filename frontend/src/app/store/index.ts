import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducers';
import { kpiReducer, KpiState } from './kpi/kpi.reducer';
import { messageReducer, MessageState } from './message/message.reducers';
import { playerReducer, PlayerState } from './player/player.reducer';

export interface State {
    auth: AuthState;
    messages: MessageState;
    kpi: KpiState;
    player: PlayerState;
}

export const reducers: ActionReducerMap<State> = {
    auth: authReducer,
    messages: messageReducer,
    kpi: kpiReducer,
    player: playerReducer,
};

export const metaReducers: MetaReducer<State>[] = [];
