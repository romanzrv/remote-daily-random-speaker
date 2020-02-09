import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../services/user-service.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-select',
  templateUrl: './user-select.component.html',
  styleUrls: ['./user-select.component.scss']
})
export class UserSelectComponent implements OnInit {
  private usersList: any;
  private selectedUser: any;

  constructor(private userService: UserServiceService,
              private cookieService: CookieService,
              private router: Router) { }

  ngOnInit() {
    if (this.getUserCookie() !== '') {
      this.router.navigate(['/speaker-screen']);
    } else {
      this.userService.getAllUsers().subscribe((usersData) => {
        this.usersList = usersData;
        console.log(this.usersList);
      });
    }
  }

  selectUser(userId) {
    this.selectedUser = userId;
    this.setUserCookie();
  }

  joinDaily() {
    this.router.navigate(['/speaker-screen']);
  }

  setUserCookie() {
    this.cookieService.set('daily-user', this.selectedUser);
  }

  getUserCookie() {
    return this.cookieService.get('daily-user');
  }

}
