import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TPaginatedRaffles } from '../interfaces/paginated-raffles.type';

@Injectable({
  providedIn: 'root',
})
export class RaffleService {
  constructor(private readonly httpClient: HttpClient) {}

  getRaffles() {
    return this.httpClient.get<TPaginatedRaffles>(
      `${environment.backendURI}/raffle`
    );
  }
}
