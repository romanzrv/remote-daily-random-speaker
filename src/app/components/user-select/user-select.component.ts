import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../services/user-service.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {SocketioService} from '../../services/socketio.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-user-select',
  templateUrl: './user-select.component.html',
  styleUrls: ['./user-select.component.scss']
})
export class UserSelectComponent implements OnInit {
  usersList: any;
  selectedUser: any;
  spectatorModeChecked: any = false;

  constructor(private userService: UserServiceService,
              private cookieService: CookieService,
              private router: Router,
              private snackBar: MatSnackBar,
              private socketioService: SocketioService) {
  }

  ngOnInit() {

    if (this.getUserSpectatorStatusCookie() === '') {
      this.setUserSpectatorStatusCookie();
    } else if (this.getUserSpectatorStatusCookie() !== '') {
      this.spectatorModeChecked = this.getUserSpectatorStatusCookie() === 'true';
    }

    if (this.getUserCookie() !== '') {
      this.router.navigate(['/speaker-screen']);
    } else if (this.getUserCookie() === '') {
      this.userService.getAllUsers().subscribe((usersData) => {
        this.usersList = usersData;
      });
    }
  }

  selectUser(userId, user) {
    this.selectedUser = userId;
    this.setUserCookie();

    this.usersList.forEach((value) => {
      value.active = false;
    });

    user.active = !user.active;
    this.joinDaily();
  }

  joinDaily() {
    if (this.getUserCookie() === '') {
      this.showMessageSnackBar('User not selected!', 'OK');
    } else {
      this.checkIfUserAlreadyConnected(this.getUserCookie());
    }
  }

  setUserCookie() {
    this.cookieService.set('daily-user', this.selectedUser, 5, '/', environment.HOST_URL, false, 'Strict');
  }

  setUserSpectatorStatusCookie() {
    this.cookieService.set('spectator', this.spectatorModeChecked, 9999, '/', environment.HOST_URL, false, 'Strict');
  }

  getUserCookie() {
    return this.cookieService.get('daily-user');
  }

  getUserSpectatorStatusCookie() {
    return this.cookieService.get('spectator');
  }

  showMessageSnackBar(message, action) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

  checkIfUserAlreadyConnected(userId) {
    this.userService.checkIfUserAlreadyConnected(userId).subscribe((isConnected) => {
      if (isConnected) {
        this.showMessageSnackBar('This user is already connected!', 'OK');
      } else {
        this.router.navigate(['/speaker-screen']);
      }
    });
  }

  toggleSpectatorCookieValue() {
    this.spectatorModeChecked = !this.spectatorModeChecked;
    this.setUserSpectatorStatusCookie();
  }
}
