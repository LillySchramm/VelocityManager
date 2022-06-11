import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KPIS } from '../models/kpi.model';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class KpiService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    public fetchKPIs(): Observable<KPIS> {
        return this.http.get<KPIS>(environment.apiUrl + '/kpi/all', {
            headers: this.authService.generateHeader(),
        });
    }
}
