import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private usersApiUrl = 'http://localhost:3000/api/users/';

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get(this.usersApiUrl);
  }

  getUser(userId) {
    return this.http.get(`${this.usersApiUrl}${userId}`);
  }

  joinUserToTheDaily(userId) {
  }
}
