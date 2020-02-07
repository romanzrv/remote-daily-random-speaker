import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MeetingServiceService {
  private meetingApiUrl = 'http://localhost:3000/api/meeting/';

  constructor(private http: HttpClient) { }

  getUsersOfMeeting() {
    return this.http.get(this.meetingApiUrl);
  }

  joinUserToTheMeeting(userId) {
    return this.http.post(this.meetingApiUrl, {userId});
  }

  removeUserFromTheMeeting(userId) {
    return this.http.delete(`${this.meetingApiUrl}${userId}`);
  }
}
