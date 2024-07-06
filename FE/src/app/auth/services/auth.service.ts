import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPostLoginAttributes } from '@shared/post-login.attributes';
import { IPostRegisterAttributes } from '@shared/post-register.attributes';
import { EUserRoles } from '@shared/user-roles.enum';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly httpClient: HttpClient) {}

  register(data: IPostRegisterAttributes) {
    return this.httpClient.post(
      `${environment.backendURI}/auth/register`,
      data
    );
  }

  login(data: IPostLoginAttributes) {
    return this.httpClient.post(`${environment.backendURI}/auth/login`, data);
  }

  logout() {
    return this.httpClient.get(`${environment.backendURI}/auth/logout`);
  }

  getUserRole() {
    return this.httpClient
      .get(`${environment.backendURI}/auth/use-role`, {
        responseType: 'text',
      })
      .pipe(map((role) => role as EUserRoles.ADMIN | EUserRoles.USER));
  }

  getUserId() {
    return this.httpClient.get<number>(
      `${environment.backendURI}/auth/user-id`
    );
  }
}
