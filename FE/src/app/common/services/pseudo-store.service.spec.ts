import { TestBed } from '@angular/core/testing';

import { PseudoStoreService } from './pseudo-store.service';

describe('PseudoStoreService', () => {
  let service: PseudoStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PseudoStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
