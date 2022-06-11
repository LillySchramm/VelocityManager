import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { logout } from 'src/app/store/auth/auth.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    constructor(private store: Store) {}
    items: MenuItem[] = [];

    ngOnInit() {
        this.items = [];
    }

    onLogout(): void {
        this.store.dispatch(logout());
    }
}
