import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { loadCredentials, logout } from './store/auth/auth.actions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'website';

    items: MenuItem[] = [];
    activeItem!: MenuItem;

    constructor(private authService: AuthService, private store: Store) {}

    ngOnInit() {
        this.items = [
            { label: 'Home', icon: 'pi pi-fw pi-home' },
            { label: 'Logout', icon: 'pi pi-fw pi-user' },
        ];

        this.activeItem = this.items[0];
        this.items[1].command = () => {
            this.store.dispatch(logout());
        };

        this.store.dispatch(loadCredentials());
    }
}
