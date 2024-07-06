import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IPutLandmarkAttributes } from '@shared/put-landmark.attributes';

import { IGetLandmarkQueryAttributes } from '@shared/get-landmark-query.attribute';
import { IGetLandmarkTypesQueryAttributes } from '@shared/get-landmark-types-query.attributes';
import { IPostLandmarkAttributes } from '@shared/post-landmark.attrbutes';
import { ILandmarkType } from '../../admin/landmark/add-landmark-dialog/interfaces/landmark-type.interface';
import { TPaginatedLandmarks } from '../../admin/landmark/interfaces/paginated-landmarks.type';

@Injectable({
  providedIn: 'root',
})
export class LandmarkService {
  constructor(private readonly httpClient: HttpClient) {}

  getLandmarks({
    isEvent,
    includeInactive,
    skip,
    take,
  }: IGetLandmarkQueryAttributes) {
    return this.httpClient.get<TPaginatedLandmarks>(
      `${environment.backendURI}/landmark`,
      { params: { isEvent, includeInactive, skip, take } }
    );
  }

  getLandmarkTypes({ isEvent }: IGetLandmarkTypesQueryAttributes) {
    return this.httpClient.get<ILandmarkType[]>(
      `${environment.backendURI}/landmark/types`,
      { params: { isEvent } }
    );
  }

  updateLandmark(body: IPutLandmarkAttributes) {
    return this.httpClient.put(`${environment.backendURI}/landmark`, body);
  }

  addLandmark(body: IPostLandmarkAttributes) {
    return this.httpClient.post(`${environment.backendURI}/landmark`, body);
  }
}
