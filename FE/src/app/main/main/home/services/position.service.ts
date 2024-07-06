import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TCoords } from '@shared/coords.type';
import { environment } from 'src/environments/environment';
import { ISharedPosition } from '../interfaces/shared-position.interface';

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  constructor(private readonly httpClient: HttpClient) {}

  getCurrentPosition() {
    return new Promise<TCoords | null>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((geolocationPosition) => {
        const coords: TCoords = [
          geolocationPosition.coords.latitude,
          geolocationPosition.coords.longitude,
        ];
        resolve(coords);
      }, reject);
    }).catch(() => null);
  }

  updateCurrentPosition(coords: TCoords) {
    return this.httpClient.put(`${environment.backendURI}/home/position`, {
      coords,
    });
  }

  getPositionShared() {
    return this.httpClient.get<boolean>(
      `${environment.backendURI}/home/position-shared`
    );
  }

  getSharedPositions() {
    return this.httpClient.get<ISharedPosition[]>(
      `${environment.backendURI}/home/shared-positions`
    );
  }
}
