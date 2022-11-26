import { createAction, props } from '@ngrx/store';

export const login = createAction(
    '[AUTH] Login',
    props<{ username: string; password: string }>()
);

export const loginSuccess = createAction('[AUTH] Login Success');

export const loginFail = createAction('[AUTH] Login Fail');

export const logout = createAction('[AUTH] Logout');

export const logoutSuccess = createAction('[AUTH] Logout Success');

//export const loadCredentials = createAction('[AUTH] Loading Credentials');

export const loadCredentialsSuccess = createAction(
    '[AUTH] Successfully Loaded Credentials',
    props<{ token: string }>()
);

export const loadCredentialsFail = createAction(
    '[AUTH] Loading Credentials Failed'
);
