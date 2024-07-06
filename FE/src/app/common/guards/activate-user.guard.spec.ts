import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { activateUserGuard } from './activate-user.guard';

describe('activateUserGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => activateUserGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
