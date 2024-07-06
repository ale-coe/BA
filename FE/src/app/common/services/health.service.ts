import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  constructor(private readonly httpClient: HttpClient) {}

  getHealth() {
    return this.httpClient
      .get<boolean>(`${environment.backendURI}/health`)
      .pipe(catchError(() => of(false)));
  }
}
