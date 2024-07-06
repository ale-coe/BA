import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPaginationAttributes } from '@shared/pagination.attributes';
import { environment } from 'src/environments/environment';
import { TPaginatedRanking } from '../../../ladder/interfaces/paginated-ranking.interface';

@Injectable({
  providedIn: 'root',
})
export class PointsService {
  constructor(private readonly httpClient: HttpClient) {}

  getCurrentBalance() {
    return this.httpClient.get<number>(
      `${environment.backendURI}/points/balance`
    );
  }

  getCurrentMonthsPoints() {
    return this.httpClient.get<number>(
      `${environment.backendURI}/points/current`
    );
  }

  getRanking({ skip, take }: IPaginationAttributes = { skip: 0, take: 10 }) {
    return this.httpClient.get<TPaginatedRanking>(
      `${environment.backendURI}/points/ranking`,
      { params: { skip, take } }
    );
  }
}
