import {Component, OnDestroy, OnInit} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SocketioService } from '../../services/socketio.service';
import {Router} from '@angular/router';
import {UserServiceService} from '../../services/user-service.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-speaker-screen',
  templateUrl: './speaker-screen.component.html',
  styleUrls: ['./speaker-screen.component.scss']
})
export class SpeakerScreenComponent implements OnInit {
  connectedUsersList: any;
  offlineUsersList: any;
  currentConnectedUser: any;
  isHostUser = false;
  isMyTurn = false;
  meetingStarted: any;
  currentSpeaker: any;
  meetingDone: any;
  timerValue: any;
  dailyTitle: string;
  dailySubTitle: string;

  constructor(private cookieService: CookieService,
              private socketService: SocketioService,
              private userService: UserServiceService,
              private router: Router) { }

  ngOnInit() {
    if (this.getCurrentUserId() === '') {
      this.router.navigate(['/user-select']);
    } else {
      this.dailyTitle = environment.SPEAKER_SCREEN_TITLE;
      this.dailySubTitle = environment.SPEAKER_SCREEN_SUBTITLE;
      this.checkConnectionStatus();
      this.checkIfMeetingStarted();
      this.socketService.setupSocketConnection(this.getCurrentUserId(), this.getUserSpectatorStatusCookie());
      this.getConnectedUsersList();
      this.getCurrentTimerValue();
    }
  }

  getConnectedUsersList() {
    this.socketService.currentConnectedUser.subscribe((connectedUsersData: any) => {
      this.connectedUsersList = connectedUsersData;
      this.getCurrentUser();
      this.getOfflineUsersList();
    });
  }

  getCurrentTimerValue() {
    this.socketService.timer.subscribe((timer: any) => {
      this.timerValue = this.timerValue ? `${timer.minutes}:${timer.seconds}` : '0:0';
    });
  }

  getOfflineUsersList() {
    this.userService.getAllUsers().subscribe((usersData: any) => {
      this.offlineUsersList = usersData.filter((item) => !this.connectedUsersList.find(({_id}) => item._id === _id));
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
        this.cookieService.set('daily-user', '', 5, '/', environment.HOST_URL, false, 'Strict');

        const audio = new Audio('/assets/audio/02.mp3');
        audio.play();
        audio.addEventListener('ended', () => {
          setTimeout(() => {
            this.router.navigate(['/user-select']);
            location.reload();
          }, 2000);
        });
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
    this.timerValue = '0:0';
    this.currentSpeaker = '';
  }

  changeUser() {
    this.cookieService.set('daily-user', '', 5, '/', environment.HOST_URL, false, 'Strict');
    this.socketService.disconnectCurrentUser();
    this.router.navigate(['/user-select']);
  }

  getCurrentUserId() {
    return this.cookieService.get('daily-user');
  }

  getUserSpectatorStatusCookie() {
    return this.cookieService.get('spectator');
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
        this.cookieService.set('daily-user', '', 5, '/', environment.HOST_URL, false, 'Strict');
        this.router.navigate(['/user-select']);
      }
    });

    this.socketService.kickUsers.subscribe((connectionStatus: any) => {
      if (connectionStatus === true) {
        this.cookieService.set('daily-user', '', 5, '/', environment.HOST_URL, false, 'Strict');
        this.router.navigate(['/user-select']);
        location.reload();
      }
    });
  }

}
