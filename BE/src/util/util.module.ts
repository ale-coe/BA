import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmountEntity } from '../database/entities/amount.entity';
import { CategoryEntity } from '../database/entities/category.entity';
import { ImageEntity } from '../database/entities/image.entity';
import { UserEntity } from '../database/entities/user.entity';
import { ImageClassifierService } from '../util/services/image-classifier/image-classifier.service';
import { QueueService } from '../util/services/queue/queue.service';
import { PushNotificationService } from './services/push-notification/push-notification.service';
import { CronService } from './services/cron/cron.service';
import { PointsService } from './services/points/points.service';
import { EmailService } from './services/email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ImageEntity,
      AmountEntity,
      CategoryEntity,
      UserEntity,
    ]),
  ],
  providers: [
    ImageClassifierService,
    QueueService,
    PushNotificationService,
    CronService,
    PointsService,
    EmailService,
  ],
  exports: [
    ImageClassifierService,
    QueueService,
    PushNotificationService,
    PointsService,
    EmailService,
  ],
})
export class UtilModule {}
