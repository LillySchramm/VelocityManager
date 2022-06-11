import { createAction, props } from '@ngrx/store';
import { Message } from 'primeng/api';

export const addMessagesToQueue = createAction(
    '[MESSAGES] Add Messages To Queue',
    props<{ messages: Message[] }>()
);

export const removeMessagesFromQueue = createAction(
    '[MESSAGES] Remove Messages From Queue',
    props<{ ids: String[] }>()
);
