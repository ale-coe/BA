import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPostNotificationSubscriptionAttributes } from '@shared/post-notification-id.attributes';
import { environment } from 'src/environments/environment';
import { IPostPushNotificationAttributes } from '@shared/post-push-notification.attributes';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor(private readonly httpClient: HttpClient) {}

  setNotificationSubscription(body: IPostNotificationSubscriptionAttributes) {
    return this.httpClient.post(
      `${environment.backendURI}/push-notification`,
      body
    );
  }

  sendNotification(body: IPostPushNotificationAttributes) {
    return this.httpClient.post(
      `${environment.backendURI}/push-notification/send`,
      body
    );
  }
}
