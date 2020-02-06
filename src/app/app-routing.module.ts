import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserSelectComponent} from './components/user-select/user-select.component';
import {SpeakerScreenComponent} from './components/speaker-screen/speaker-screen.component';


const routes: Routes = [
  {path: 'user-select', component: UserSelectComponent},
  {path: 'speaker-screen', component: SpeakerScreenComponent},
  {path: '', component: UserSelectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
