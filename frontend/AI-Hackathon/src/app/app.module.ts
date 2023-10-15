import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ChatWindowComponent } from '../components/chat-window/chat-window.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { CanvasWindowComponent } from 'src/components/canvas-window/canvas-window.component';
import { NavbarComponent } from 'src/components/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatWindowComponent,
    CanvasWindowComponent,
    NavbarComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
