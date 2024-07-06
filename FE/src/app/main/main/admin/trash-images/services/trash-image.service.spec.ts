import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TrashImageService } from './trash-image.service';

describe('TrashImageService', () => {
  let service: TrashImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(TrashImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
