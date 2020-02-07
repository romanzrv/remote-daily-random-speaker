import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserSelectComponent } from './components/user-select/user-select.component';
import { SpeakerScreenComponent } from './components/speaker-screen/speaker-screen.component';
import { HttpClientModule } from '@angular/common/http';
import { CookieService} from 'ngx-cookie-service';
import { SocketioService} from './services/socketio.service';

@NgModule({
  declarations: [
    AppComponent,
    UserSelectComponent,
    SpeakerScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [CookieService, SocketioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
