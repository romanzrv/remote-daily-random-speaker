import {Component, OnDestroy, OnInit} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SocketioService } from '../../services/socketio.service';

@Component({
  selector: 'app-speaker-screen',
  templateUrl: './speaker-screen.component.html',
  styleUrls: ['./speaker-screen.component.scss']
})
export class SpeakerScreenComponent implements OnInit {
  private connectedUsersList: any;

  constructor(private cookieService: CookieService,
              private socketService: SocketioService) { }

  ngOnInit() {
    this.socketService.setupSocketConnection(this.getCurrentUserId());
    this.getConnectedUsersList();
  }

  getConnectedUsersList() {
    this.socketService.currentConnectedUser.subscribe((connectedUsersData) => {
      this.connectedUsersList = connectedUsersData;
      console.log(this.connectedUsersList);
    });
  }

  getCurrentUserId() {
    return this.cookieService.get('daily-user');
  }

}
