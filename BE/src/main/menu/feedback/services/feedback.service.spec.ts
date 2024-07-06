import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackCategoryEntity } from '../../../../database/entities/feedback-category.entity';
import { FeedbackTypesEntity } from '../../../../database/entities/feedback-type.entity';
import { FeedbackEntity } from '../../../../database/entities/feedback.entity';
import { FeedbackService } from './feedback.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('FeedbackService', () => {
  let service: FeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        { provide: getRepositoryToken(FeedbackCategoryEntity), useValue: {} },
        { provide: getRepositoryToken(FeedbackTypesEntity), useValue: {} },
        { provide: getRepositoryToken(FeedbackEntity), useValue: {} },
      ],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
