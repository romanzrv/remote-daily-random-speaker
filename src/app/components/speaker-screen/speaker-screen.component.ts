import {Component, OnDestroy, OnInit} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SocketioService } from '../../services/socketio.service';
import {Router} from '@angular/router';
import {UserServiceService} from '../../services/user-service.service';

@Component({
  selector: 'app-speaker-screen',
  templateUrl: './speaker-screen.component.html',
  styleUrls: ['./speaker-screen.component.scss']
})
export class SpeakerScreenComponent implements OnInit {
  private connectedUsersList: any;
  private currentConnectedUser: any;
  private isHostUser = false;

  constructor(private cookieService: CookieService,
              private socketService: SocketioService,
              private userService: UserServiceService,
              private router: Router) { }

  ngOnInit() {
    if (this.getCurrentUserId() === '') {
      this.router.navigate(['/user-select']);
    } else {
      this.socketService.setupSocketConnection(this.getCurrentUserId());
      this.getConnectedUsersList();
    }
  }

  getConnectedUsersList() {
    this.socketService.currentConnectedUser.subscribe((connectedUsersData) => {
      this.connectedUsersList = connectedUsersData;
      this.getCurrentUser();
    });
  }

  getCurrentUser() {
    this.userService.getUser(this.getCurrentUserId()).subscribe((userProfile) => {
      this.currentConnectedUser = userProfile;
      this.checkIfHostUser();
    });
  }

  checkIfHostUser() {
    const currentUserId = this.getCurrentUserId();
    for (const value of this.connectedUsersList) {
      if (value._id === currentUserId) {
        if (value.host) {
          this.isHostUser = value.host;
        }
      }
    }
  }

  getCurrentUserId() {
    return this.cookieService.get('daily-user');
  }

}
