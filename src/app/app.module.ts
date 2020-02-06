import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserSelectComponent } from './components/user-select/user-select.component';
import { SpeakerScreenComponent } from './components/speaker-screen/speaker-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    UserSelectComponent,
    SpeakerScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
