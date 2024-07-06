import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPutTrashImageAttributes } from '@shared/put-trash-image.attributes';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrashImageService {
  constructor(private readonly httpClient: HttpClient) {}

  updateTrashImage(body: IPutTrashImageAttributes) {
    return this.httpClient.put(`${environment.backendURI}/trash-image`, body);
  }
}
