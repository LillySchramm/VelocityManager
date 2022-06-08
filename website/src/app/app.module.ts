import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MenubarModule } from 'primeng/menubar';
import { TabMenuModule } from 'primeng/tabmenu';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MenubarModule,
        TabMenuModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
