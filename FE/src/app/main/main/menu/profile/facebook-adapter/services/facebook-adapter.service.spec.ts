import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FacebookAdapterService } from './facebook-adapter.service';

describe('FacebookAdapterService', () => {
  let service: FacebookAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(FacebookAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
