import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IPostTweetAttributes } from '@shared/post-tweet.attributes';
import { IPostConnectAccountAttributes } from '@shared/post-conntect-account.attributes';

@Injectable({
  providedIn: 'root',
})
export class TwitterService {
  constructor(private readonly httpClient: HttpClient) {}

  getAccountConnected() {
    return this.httpClient.get(
      `${environment.backendURI}/twitter/account-connected`,
      { responseType: 'text' }
    );
  }

  getLoginUrl() {
    return this.httpClient.get(`${environment.backendURI}/twitter/login-url`, {
      responseType: 'text',
    });
  }

  postConnectAccount(body: IPostConnectAccountAttributes) {
    return this.httpClient.post(
      `${environment.backendURI}/twitter/connect-account`,
      body
    );
  }

  postTweet(body: IPostTweetAttributes) {
    return this.httpClient.post(`${environment.backendURI}/twitter`, body);
  }
}
