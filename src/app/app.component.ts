import { Component, OnInit } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { resolve } from 'dns';
import { rejects } from 'assert';
import { LocationService } from './app.services';
import { IDriverLocation } from './models/driverlocation.entity';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [LocationService]
})
export class AppComponent implements OnInit {
  title = 'SignalRClient';
  restaurantId = 'KTBHQ1';
  connectionId: string;
  signalRUrl: string;
  private hubConnection: HubConnection;

  constructor(private locationService: LocationService) {
    // this.signalRUrl = 'https://katsubiapi20210505084701.azurewebsites.net/hubs/orders';
    this.signalRUrl = 'https://localhost:5001/hubs/orders'
  }

  public ngOnInit () {
    console.log('[SignalR Client] --> initialized, ', this.signalRUrl);
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.signalRUrl)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        this.connectionId = this.hubConnection.connectionId;
        console.log(`connection started...connectionId: ${this.connectionId}`);


        /** Driver App Signal Test */
        // this.hubConnection.invoke('AddToTrackGroup', this.connectionId, 'SLO000775');
      })
      .catch(
        err => {
          console.log(`SignalR connection error: ${err}`);
          // rejects();
        }
      );

    /** Kitchen App Signal Test */
    // // this.hubConnection.on('ReceiveConnectionId', (data) => {
    // //   console.log('connectionId/groupName:', data);
    // //   if (data.toString() != this.restaurantId) {
    // //     this.hubConnection.invoke('GetGroupFromClient', this.restaurantId, data);
    // //   }
    // // });

    // this.hubConnection.on('GroupChangeReceived', (data) => {
    //   console.log(data);
    // })

    // this.hubConnection.on('NewOrderReceived', (data) => {
    //   console.log(data);
    // });


    /** Kitchen App Signal Test */

    /** Driver App Signal Test */

    this.hubConnection.on('GroupChangeReceived', (data) => {
      console.log('[' + new Date().toISOString() + '] GroupChangeReceived', data);
    });

    this.hubConnection.on('NotifyLocation', (data) => {
      console.log('[' + new Date().toISOString() + '] NotifyLocation', data);
    });

    this.hubConnection.on('NewRequestReceived', (data) => {
      console.log('[' + new Date().toISOString() + '] NewRequestReceived', data);
    });

    this.hubConnection.on('NewDriverNotification',(data) => {
      console.log('[' + new Date().toISOString() + '] NewDriverNotification', data);
    })
    /** Driver App Signal Test */
  }

  onSendCurrentLocation() {
    const data: IDriverLocation = {
      UserId: "jkim@wavenet.cloud",
      ConnectionId: this.connectionId, // "45n3BJAH_pUgNQ9MyEJKXA",
      OrderNumber: "SLO000238",
      Latitude: -36.7456898430956,
      Longitude: 174.698243823663,
      ModifiedDate: "2021-05-26T16:54:00"
    };
    // console.log(data);

    const data$ = this.locationService.updateCurrenLocation(data).toPromise();
  }
}
