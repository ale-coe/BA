import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';

export const notLoggedInGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const httpClient = inject(HttpClient);

  return httpClient
    .get<boolean>(`${environment.backendURI}/auth/validate`)
    .pipe(
      map(() => router.parseUrl('main')),
      catchError(() => of(true))
    );
};
