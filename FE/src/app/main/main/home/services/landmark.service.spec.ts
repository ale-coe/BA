import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LandmarkService } from './landmark.service';

describe('LandmarkService', () => {
  let service: LandmarkService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(LandmarkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
