import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IPaginationAttributes } from '@shared/pagination.attributes';
import { TPaginatedTrashImages } from '../../main/main/admin/trash-images/interfaces/paginated-trash-images.type';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  constructor(private readonly httpClient: HttpClient) {}

  getImage(scope: string, imageName: string) {
    return this.httpClient.get(
      `${environment.backendURI}/file-helper/${scope}/${imageName}`,
      {
        responseType: 'text',
      }
    );
  }

  getImages(
    scope: string,
    { skip, take }: IPaginationAttributes = { take: 10, skip: 0 }
  ) {
    return this.httpClient.get<TPaginatedTrashImages>(
      `${environment.backendURI}/file-helper/${scope}`,
      { params: { skip, take } }
    );
  }

  uploadImage(scope: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(
      `${environment.backendURI}/file-helper/${scope}`,
      formData,
      { responseType: 'text' }
    );
  }
}
