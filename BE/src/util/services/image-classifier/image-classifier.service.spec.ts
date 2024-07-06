import { Test, TestingModule } from '@nestjs/testing';
import { ImageClassifierService } from './image-classifier.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AmountEntity } from '../../../database/entities/amount.entity';
import { CategoryEntity } from '../../../database/entities/category.entity';

describe('ImageClassifierService', () => {
  let service: ImageClassifierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageClassifierService,
        { provide: getRepositoryToken(AmountEntity), useValue: {} },
        { provide: getRepositoryToken(CategoryEntity), useValue: {} },
      ],
    }).compile();

    service = module.get<ImageClassifierService>(ImageClassifierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
