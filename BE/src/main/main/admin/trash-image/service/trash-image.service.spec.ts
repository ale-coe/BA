import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ImageEntity } from '../../../../../database/entities/image.entity';
import { TrashImageService } from './trash-image.service';

describe('TrashImageService', () => {
  let service: TrashImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrashImageService,
        { provide: getRepositoryToken(ImageEntity), useValue: {} },
      ],
    }).compile();

    service = module.get<TrashImageService>(TrashImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
