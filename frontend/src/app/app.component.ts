import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { loadCredentials, logout } from './store/auth/auth.actions';
import { selectIsLoggedIn } from './store/auth/auth.selectors';
import { removeMessagesFromQueue } from './store/message/message.actions';
import { selectMessageQueue } from './store/message/message.selectors';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [MessageService],
})
export class AppComponent implements OnInit {
    title = 'frontend';

    items: MenuItem[] = [];
    activeItem!: MenuItem;

    isLoggedIn$: Observable<Boolean>;

    displayedMessageIds: string[] = [];

    constructor(private store: Store, private messageService: MessageService) {
        this.isLoggedIn$ = store.select(selectIsLoggedIn);
    }

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

        this.store.select(selectMessageQueue).subscribe((messages) => {
            if (messages.length === 0) {
                return;
            }

            const messagesToBeShown = messages
                .filter(
                    (message) => !this.displayedMessageIds.includes(message.id)
                )
                .map((message) => message.message);
            this.messageService.addAll(messagesToBeShown);

            this.displayedMessageIds = messages.map((message) => message.id);

            this.store.dispatch(
                removeMessagesFromQueue({
                    ids: messages.map((message) => message.id),
                })
            );
        });
    }
}
