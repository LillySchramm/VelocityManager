import { createFeatureSelector, createSelector } from '@ngrx/store';
import { KpiState } from './kpi.reducer';

export const selectKPIs = createFeatureSelector<KpiState>('kpi');

export const selectLoadedKPIs = createSelector(selectKPIs, (kpis) => kpis.kpis);
