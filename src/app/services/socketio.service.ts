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
  private socket;

  constructor() { }

  setupSocketConnection(connectedUserId) {
    this.socket = io(environment.SOCKET_ENDPOINT, {
      query: {userId: connectedUserId}
    });

    this.socket.on('connectedUsers', (receivedData) => {
      this.connectedUsersSource.next(receivedData);
    });
  }
}
