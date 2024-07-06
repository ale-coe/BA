import { Test, TestingModule } from '@nestjs/testing';
import { CronService } from './cron.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../../database/entities/user.entity';
import { ImageEntity } from '../../../database/entities/image.entity';
import { PointsService } from '../points/points.service';
import { PushNotificationService } from '../push-notification/push-notification.service';
import { ImageClassifierService } from '../image-classifier/image-classifier.service';
import { QueueService } from '../queue/queue.service';
import { EmailService } from '../email/email.service';

describe('CronService', () => {
  let service: CronService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CronService,
        { provide: getRepositoryToken(UserEntity), useValue: {} },
        { provide: getRepositoryToken(ImageEntity), useValue: {} },
        { provide: PointsService, useValue: {} },
        { provide: PushNotificationService, useValue: {} },
        { provide: ImageClassifierService, useValue: {} },
        { provide: QueueService, useValue: {} },
        { provide: EmailService, useValue: {} },
      ],
    }).compile();

    service = module.get<CronService>(CronService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
