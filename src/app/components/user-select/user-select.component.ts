import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../services/user-service.service';

@Component({
  selector: 'app-user-select',
  templateUrl: './user-select.component.html',
  styleUrls: ['./user-select.component.scss']
})
export class UserSelectComponent implements OnInit {
  private usersList: any;

  constructor(private userService: UserServiceService) { }

  ngOnInit() {
    this.userService.getAllUsers().subscribe((data) => {
      this.usersList = data;
    });
  }

}
