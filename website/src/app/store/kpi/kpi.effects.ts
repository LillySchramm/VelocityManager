import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { KpiService } from 'src/app/services/kpi.service';
import { loadKPIs, loadKPIsSuccess } from './kpi.actions';

@Injectable()
export class KpiEffects {
    loadKpis$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadKPIs),
            switchMap(() => this.kpiService.fetchKPIs()),
            map((kpis) => loadKPIsSuccess({ kpis }))
        )
    );

    constructor(private actions$: Actions, private kpiService: KpiService) {}
}
