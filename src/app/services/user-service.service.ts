import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  usersApiUrl = `http://${environment.HOST_URL}:3000/api/users/`;

  constructor(private http: HttpClient) { }

  getAllUsers() {
    return this.http.get(this.usersApiUrl);
  }

  getUser(userId) {
    return this.http.get(`${this.usersApiUrl}${userId}`);
  }

  checkIfUserAlreadyConnected(userId) {
    return this.http.get(`${this.usersApiUrl}connected/${userId}`);
  }
}
