import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'website';

    items: MenuItem[] = [];
    activeItem!: MenuItem;

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.items = [
            { label: 'Home', icon: 'pi pi-fw pi-home' },
            { label: 'Logout', icon: 'pi pi-fw pi-user' },
        ];

        this.activeItem = this.items[0];
        this.items[1].command = () => {
            this.authService.logout();
        };
    }
}
