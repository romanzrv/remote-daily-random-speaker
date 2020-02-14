import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserSelectComponent } from './components/user-select/user-select.component';
import { SpeakerScreenComponent } from './components/speaker-screen/speaker-screen.component';
import { HttpClientModule } from '@angular/common/http';
import { CookieService} from 'ngx-cookie-service';
import { SocketioService} from './services/socketio.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule, MatSidenavModule } from '@angular/material';
import { MatSnackBarModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    UserSelectComponent,
    SpeakerScreenComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatListModule,
        MatSidenavModule,
      MatSnackBarModule
    ],
  providers: [CookieService, SocketioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
