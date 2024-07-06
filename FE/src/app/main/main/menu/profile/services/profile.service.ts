import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IProfileData } from '../interfaces/profile-data.interface';
import { IPutShowPositionAttributes } from '@shared/put-show-position.attributes';
import { IPutProfileAttributes } from '@shared/put-profile.attributes';
import { IPutUserProfileAttributes } from '@shared/put-user-profile.attributes';
import { IPostPositionSharedAttributes } from '@shared/post-position-shared.attributes';
import { IDeletePositionSharedAttributes } from '@shared/delete-position-shared.attributes';
import { IGetUserQueryAttributes } from '@shared/get-user-query.attributes';
import { IPositionShared } from '../update-position-sharing-dialog/interfaces/position-shared.interface';
import { IUser } from '../interfaces/user.interface';
import { IUserProfile } from '../../../admin/profile-admin/interfaces/user-profile.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private readonly httpClient: HttpClient) {}

  getUser({ search }: IGetUserQueryAttributes) {
    return this.httpClient.get<IUser[]>(
      `${environment.backendURI}/profile/user`,
      {
        params: { search },
      }
    );
  }

  updateUserProfile(body: IPutUserProfileAttributes, userId: number) {
    return this.httpClient.put(
      `${environment.backendURI}/profile/user/${userId}/profile`,
      body
    );
  }

  deleteProfileImage(userId: number) {
    return this.httpClient.delete(
      `${environment.backendURI}/profile/user/${userId}/profile-image`
    );
  }

  getUserProfile(userId: number) {
    return this.httpClient.get<IUserProfile>(
      `${environment.backendURI}/profile/user/${userId}/profile`
    );
  }

  getProfile() {
    return this.httpClient.get<IProfileData>(
      `${environment.backendURI}/profile`
    );
  }

  getPositionShared() {
    return this.httpClient.get<IPositionShared[]>(
      `${environment.backendURI}/profile/position-shared`
    );
  }

  postPositionShared(body: IPostPositionSharedAttributes) {
    return this.httpClient.post<IPositionShared[]>(
      `${environment.backendURI}/profile/position-shared`,
      body
    );
  }

  deletePositionShared(params: IDeletePositionSharedAttributes) {
    return this.httpClient.delete(
      `${environment.backendURI}/profile/position-shared/`,
      { params: params as any }
    );
  }

  updateShowPosition(body: IPutShowPositionAttributes) {
    return this.httpClient.put(
      `${environment.backendURI}/profile/show-position`,
      body
    );
  }

  updateProfile(body: IPutProfileAttributes) {
    return this.httpClient.put(`${environment.backendURI}/profile`, body);
  }
}
