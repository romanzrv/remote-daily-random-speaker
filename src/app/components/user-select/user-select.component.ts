import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../services/user-service.service';
import { CookieService } from 'ngx-cookie-service';
import {MeetingServiceService} from '../../services/meeting-service.service';

@Component({
  selector: 'app-user-select',
  templateUrl: './user-select.component.html',
  styleUrls: ['./user-select.component.scss']
})
export class UserSelectComponent implements OnInit {
  private usersList: any;
  private selectedUser: any;

  constructor(private userService: UserServiceService,
              private meetingService: MeetingServiceService,
              private cookieService: CookieService) { }

  ngOnInit() {
    this.userService.getAllUsers().subscribe((data) => {
      this.usersList = data;
    });
  }

  selectUser(userId) {
    this.selectedUser = userId;
    console.log(this.selectedUser);
  }

  joinDaily() {
    this.meetingService.joinUserToTheMeeting(this.selectedUser).subscribe((data) => {
      this.setUserCookie();
      console.log(data);
    });
  }

  setUserCookie() {
    this.cookieService.set('daily-user', this.selectedUser);
  }

}
