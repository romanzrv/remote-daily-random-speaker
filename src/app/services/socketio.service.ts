import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from '../../environments/environment';
import {query} from '@angular/animations';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  connectedUsersSource = new BehaviorSubject('');
  currentConnectedUser = this.connectedUsersSource.asObservable();

  meetingStatusSource = new BehaviorSubject('');
  meetingStatus = this.meetingStatusSource.asObservable();

  speakerIdSource = new BehaviorSubject('');
  currentSpeaker = this.speakerIdSource.asObservable();

  connectionStatusSource = new BehaviorSubject('');
  connectionStatus = this.connectionStatusSource.asObservable();

  kickUsersSource = new BehaviorSubject('');
  kickUsers = this.kickUsersSource.asObservable();

  timerSource = new BehaviorSubject('');
  timer = this.timerSource.asObservable();

  socket;

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

    this.socket.on('connectionStatus', (connectionStatus) => {
      this.connectionStatusSource.next(connectionStatus);
    });

    this.socket.on('kickAllUsers', (connectionStatus) => {
      this.kickUsersSource.next(connectionStatus);
    });

    this.socket.on('timer', (timer) => {
      this.timerSource.next(timer);
    });
  }

  emitStartDailyEvent() {
    this.socket.emit('startDaily', true);
  }

  finishSpeaking(lastSpeakerId) {
    this.socket.emit('nextSpeaker', lastSpeakerId);
  }

  disconnectCurrentUser() {
    this.socket.emit('disconnectCurrentUser', true);
  }

  getCurrentSpeaker() {
    this.socket.emit('currentSpeaker', true);
  }
}
