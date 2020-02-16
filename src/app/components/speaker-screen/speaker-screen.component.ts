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
  connectedUsersList: any;
  currentConnectedUser: any;
  isHostUser = false;
  isMyTurn = false;
  meetingStarted: any;
  currentSpeaker: any;
  meetingDone: any;

  constructor(private cookieService: CookieService,
              private socketService: SocketioService,
              private userService: UserServiceService,
              private router: Router) { }

  ngOnInit() {
    if (this.getCurrentUserId() === '') {
      this.router.navigate(['/user-select']);
    } else {
      this.checkConnectionStatus();
      this.checkIfMeetingStarted();
      this.socketService.setupSocketConnection(this.getCurrentUserId());
      this.getConnectedUsersList();
    }
  }

  getConnectedUsersList() {
    this.socketService.currentConnectedUser.subscribe((connectedUsersData: any) => {
      this.connectedUsersList = connectedUsersData;
      this.getCurrentUser();
    });
  }

  getCurrentUser() {
    this.userService.getUser(this.getCurrentUserId()).subscribe((userProfile) => {
      this.currentConnectedUser = userProfile;
      this.checkIfHostUser();
      this.getDailyStatus();
      this.getNextSpeaker();
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

  startDaily() {
    if (this.isHostUser) {
      this.socketService.emitStartDailyEvent();
    }
  }

  getDailyStatus() {
    this.socketService.meetingStatus.subscribe((currentDailyStatus) => {
      this.meetingStarted = currentDailyStatus;
      if (this.meetingStarted === 'finished') {
        this.meetingStarted = false;
        this.meetingDone = true;
      }
    });
  }

  getNextSpeaker() {
    this.socketService.currentSpeaker.subscribe((speakerId) => {
      if (speakerId === this.getCurrentUserId()) {
        this.isMyTurn = true;
      } else {
        this.userService.getUser(speakerId).subscribe((userData) => {
          this.currentSpeaker = userData;
        });
      }
    });
  }

  finishSpeaking() {
    this.isMyTurn = false;
    this.socketService.finishSpeaking(this.getCurrentUserId());
  }

  changeUser() {
    this.cookieService.set('daily-user', '');
    this.socketService.disconnectCurrentUser();
    this.router.navigate(['/user-select']);
  }

  getCurrentUserId() {
    return this.cookieService.get('daily-user');
  }

  checkIfMeetingStarted() {
    this.userService.checkIfCurrentMeetingStarted().subscribe((isStarted) => {
      this.meetingStarted = isStarted;
      if (this.meetingStarted) {
        this.socketService.getCurrentSpeaker();
      }
    });
  }

  checkConnectionStatus() {
    this.socketService.connectionStatus.subscribe((connectionStatus: any) => {
      if (connectionStatus.action === 'reconnect' && connectionStatus.userId === this.getCurrentUserId()) {
        this.cookieService.set('daily-user', '');
        this.router.navigate(['/user-select']);
      }
    });
  }

}
