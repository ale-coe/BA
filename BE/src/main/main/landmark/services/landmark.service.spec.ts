import { Test, TestingModule } from '@nestjs/testing';
import { LandmarkTypeEntity } from '../../../../database/entities/landmark-type.entity';
import { LandmarkEntity } from '../../../../database/entities/landmark.entity';
import { PushNotificationService } from '../../../../util/services/push-notification/push-notification.service';
import { LandmarkService } from './landmark.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('LandmarkService', () => {
  let service: LandmarkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LandmarkService,
        { provide: getRepositoryToken(LandmarkTypeEntity), useValue: {} },
        { provide: getRepositoryToken(LandmarkEntity), useValue: {} },
        { provide: PushNotificationService, useValue: {} },
      ],
    }).compile();

    service = module.get<LandmarkService>(LandmarkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
