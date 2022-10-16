import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { KPIS } from 'src/app/models/kpi.model';
import { loadKPIs } from 'src/app/store/kpi/kpi.actions';
import { selectLoadedKPIs } from 'src/app/store/kpi/kpi.selectors';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    public currentKpis?: KPIS;

    constructor(private store: Store) {}

    ngOnInit(): void {
        this.store.dispatch(loadKPIs());
        this.store.select(selectLoadedKPIs).subscribe((kpis) => {
            this.currentKpis = kpis;
        });
    }
}
