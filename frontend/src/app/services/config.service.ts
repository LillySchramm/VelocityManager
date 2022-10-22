import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseOptions } from 'firebase/app';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ConfigService {
    constructor(private http: HttpClient) {}

    async firebase(): Promise<FirebaseOptions> {
        return this.http
            .get<FirebaseOptions>(`${environment.apiUrl}/config/firebase`)
            .toPromise();
    }
}
