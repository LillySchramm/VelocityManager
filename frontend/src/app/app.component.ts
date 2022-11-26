import { Component, Injector, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Store } from '@ngrx/store';
import { MenuItem, MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { AppInjector, fireauth } from './app.module';
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

    isLoggedIn$: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(false);

    displayedMessageIds: string[] = [];

    constructor(
        private store: Store,
        private messageService: MessageService
    ) {


        if (fireauth) {
            fireauth.onAuthStateChanged(async () => {
                await this.checkIsLoggedIn();
            });
        }
    }

    async ngOnInit() {
        await this.checkIsLoggedIn();

        this.items = [
            { label: 'Home', icon: 'pi pi-fw pi-home' },
            { label: 'Logout', icon: 'pi pi-fw pi-user' },
        ];

        this.activeItem = this.items[0];
        this.items[1].command = () => {
            if (fireauth) {
                fireauth.signOut().then(() => 0);
            }
        };

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

    private async checkIsLoggedIn(): Promise<void> {
        if (fireauth && await fireauth.currentUser) {
            this.isLoggedIn$.next(true);
            return;
        }
        this.isLoggedIn$.next(false);
    }
}
