import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IPostInviteFriendAttributes } from '@shared/post-invite-friend.attributes';

@Injectable({
  providedIn: 'root',
})
export class InviteFriendService {
  constructor(private readonly httpClient: HttpClient) {}

  inviteFriend({ email, invitationDate }: IPostInviteFriendAttributes) {
    return this.httpClient.post(`${environment.backendURI}/invite-friend`, {
      email,
      invitationDate,
    });
  }
}
