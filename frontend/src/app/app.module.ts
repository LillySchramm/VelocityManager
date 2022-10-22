import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { APP_INITIALIZER } from '@angular/core';

import { MenubarModule } from 'primeng/menubar';
import { TabMenuModule } from 'primeng/tabmenu';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DialogModule } from 'primeng/dialog';

import { LoginComponent } from './components/pages/login/login.component';
import { HomeComponent } from './components/pages/home/home.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './store/auth/auth.effects';
import { HeaderComponent } from './components/core/header/header.component';
import { KpiEffects } from './store/kpi/kpi.effects';
import { PlayerComponent } from './components/pages/player/player.component';
import { PlayerEffects } from './store/player/player.effects';
import { TotpComponent } from './components/pages/totp/totp.component';
import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire/compat';
import { firebase, firebaseui, FirebaseUIModule } from 'firebaseui-angular';
import { FirebaseOptions } from 'firebase/app';
import * as syncFetch from 'sync-fetch';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
    signInFlow: 'popup',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
    ],
    credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
};

const firebaseConfig: FirebaseOptions = syncFetch(
    `${environment.apiUrl}/config/firebase`
).json();

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        HeaderComponent,
        PlayerComponent,
        TotpComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MenubarModule,
        TabMenuModule,
        CheckboxModule,
        InputTextModule,
        HttpClientModule,
        FormsModule,
        CardModule,
        ButtonModule,
        ReactiveFormsModule,
        ToastModule,
        MessagesModule,
        AvatarModule,
        AvatarGroupModule,
        TableModule,
        TagModule,
        SplitButtonModule,
        DialogModule,
        StoreModule.forRoot(reducers, {
            metaReducers,
        }),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: environment.production,
        }),
        EffectsModule.forRoot([AuthEffects, KpiEffects, PlayerEffects]),
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireAuthModule,
        FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    ],
    bootstrap: [AppComponent],
    providers: [{ provide: FIREBASE_OPTIONS, useValue: firebaseConfig }],
})
export class AppModule {}
