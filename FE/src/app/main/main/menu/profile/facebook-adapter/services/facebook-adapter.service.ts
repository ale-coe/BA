import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IGetCheckTokenQueryAttributes } from '@shared/get-check-token-query.attributes';

@Injectable({
  providedIn: 'root',
})
export class FacebookAdapterService {
  constructor(private readonly httpClient: HttpClient) {}

  checkToken(params: IGetCheckTokenQueryAttributes) {
    return this.httpClient.get(
      `${environment.backendURI}/facebook-adapter/check-token`,
      {
        params: { token: params.token },
      }
    );
  }
}
