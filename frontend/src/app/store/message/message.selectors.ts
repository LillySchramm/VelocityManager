import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessageState } from './message.reducers';

export const selectMessages = createFeatureSelector<MessageState>('messages');

export const selectMessageQueue = createSelector(
    selectMessages,
    (state) => state.messages
);
