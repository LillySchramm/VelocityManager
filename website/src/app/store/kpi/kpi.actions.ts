import { createAction, props } from '@ngrx/store';
import { KPIS } from 'src/app/models/kpi.model';

export const loadKPIs = createAction('[KPI] Loading KPIs');

export const loadKPIsSuccess = createAction(
    '[AUTH] Successfully Loaded KPIs',
    props<{ kpis: KPIS }>()
);
