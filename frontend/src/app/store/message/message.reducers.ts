import { createReducer, on } from '@ngrx/store';
import { MessageWrapper } from 'src/app/models/message.models';
import { addMessagesToQueue, removeMessagesFromQueue } from './message.actions';
import { v4 as uuidv4 } from 'uuid';

export interface MessageState {
    messages: MessageWrapper[];
}

export const initialState: MessageState = {
    messages: [],
};

export const messageReducer = createReducer(
    initialState,
    on(addMessagesToQueue, (state, { messages }) => {
        const newMessages: MessageWrapper[] = messages.map((message) => {
            return { id: uuidv4(), message };
        });
        const _messages = [...state.messages, ...newMessages];

        return { ...state, messages: _messages };
    }),
    on(removeMessagesFromQueue, (state, { ids }) => {
        const messages = [
            ...state.messages.filter((message) => !ids.includes(message.id)),
        ];
        return { ...state, messages };
    })
);
