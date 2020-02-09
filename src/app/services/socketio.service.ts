import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from '../../environments/environment';
import {query} from '@angular/animations';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  private connectedUsersSource = new BehaviorSubject('');
  public currentConnectedUser = this.connectedUsersSource.asObservable();

  private meetingStatusSource = new BehaviorSubject('');
  public meetingStatus = this.meetingStatusSource.asObservable();

  private speakerIdSource = new BehaviorSubject('');
  public currentSpeaker = this.speakerIdSource.asObservable();

  private socket;

  constructor() { }

  setupSocketConnection(connectedUserId) {
    this.socket = io(environment.SOCKET_ENDPOINT, {
      query: {userId: connectedUserId}
    });

    this.socket.on('connectedUsers', (receivedData) => {
      this.connectedUsersSource.next(receivedData);
    });

    this.socket.on('nextSpeaker', (speakerId) => {
      this.speakerIdSource.next(speakerId);
    });

    this.socket.on('dailyStatus', (dailyStatus) => {
      this.meetingStatusSource.next(dailyStatus);
    });
  }

  emitStartDailyEvent() {
    this.socket.emit('startDaily', true);
  }

  finishSpeaking(lastSpeakerId) {
    this.socket.emit('nextSpeaker', lastSpeakerId);
  }
}
