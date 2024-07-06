import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { EUserRoles } from '@shared/user-roles.enum';
import { map } from 'rxjs';
import { PseudoStoreService } from '../services/pseudo-store.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const pseudoStoreService = inject(PseudoStoreService);
  const router = inject(Router);

  return pseudoStoreService
    .getSingleValue('userRole')
    .pipe(
      map((role) =>
        role === EUserRoles.ADMIN ? true : router.parseUrl('not-found')
      )
    );
};
