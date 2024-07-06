import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';

export const loggedInGuard: CanActivateFn = () => {
  const router = inject(Router);
  const httpClient = inject(HttpClient);

  return httpClient
    .get<boolean>(`${environment.backendURI}/auth/validate`)
    .pipe(
      map((activated) =>
        activated ? true : router.parseUrl('main/activate-user')
      ),
      catchError(() => of(router.parseUrl('auth/login')))
    );
};
