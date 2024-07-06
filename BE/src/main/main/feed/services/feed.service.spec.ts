import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ImageEntity } from '../../../../database/entities/image.entity';
import { SocialMediaPostEntity } from '../../../../database/entities/social-media-post.entity';
import { DataSource } from 'typeorm';
import { FeedService } from './feed.service';

describe('FeedService', () => {
  let service: FeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        { provide: getRepositoryToken(ImageEntity), useValue: {} },
        { provide: getRepositoryToken(SocialMediaPostEntity), useValue: {} },
        { provide: DataSource, useValue: {} },
      ],
    }).compile();

    service = module.get<FeedService>(FeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
