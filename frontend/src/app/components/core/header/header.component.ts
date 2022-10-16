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
        this.items = [
            {
                label: 'Home',
                icon: 'pi pi-home',
                routerLink: 'home',
            },
            {
                label: 'Server',
                icon: 'pi pi-server',
                disabled: true,
                items: [
                    {
                        label: 'Proxy Server',
                    },
                    {
                        label: 'Game Server',
                    },
                    {
                        label: 'Game Server Types',
                    },
                ],
            },
            {
                label: 'Player',
                icon: 'pi pi-user',
                routerLink: 'player',
                style: '.p-menuitem-link-active { background-color: aquamarine; }',
            },
        ];
    }

    onLogout(): void {
        this.store.dispatch(logout());
    }
}
