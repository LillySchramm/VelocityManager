import { createReducer, on } from '@ngrx/store';
import { KPIS } from 'src/app/models/kpi.model';
import { loadKPIsSuccess } from './kpi.actions';

export interface KpiState {
    kpis?: KPIS;
}

export const initialState: KpiState = {};

export const kpiReducer = createReducer(
    initialState,
    on(loadKPIsSuccess, (state, { kpis }) => {
        return { ...state, kpis };
    })
);
