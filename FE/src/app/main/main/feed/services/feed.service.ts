import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaginationAttributes } from '@shared/pagination.attributes';
import { environment } from 'src/environments/environment';
import { TPaginatedFeed } from '../interfaces/paginated-feed.type';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  constructor(private readonly httpClient: HttpClient) {}

  getFeed({ skip, take }: IPaginationAttributes = { skip: 0, take: 10 }) {
    return this.httpClient.get<TPaginatedFeed>(
      `${environment.backendURI}/feed`,
      {
        params: { skip, take },
      }
    );
  }
}
