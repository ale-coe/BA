import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPostActivateAttributes } from '@shared/post-activate.attributes';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActivateUserService {
  constructor(private readonly httpClient: HttpClient) {}

  activateUser(data: IPostActivateAttributes) {
    return this.httpClient.post(
      `${environment.backendURI}/activate-user`,
      data
    );
  }
}
