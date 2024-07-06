import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../database/entities/user.entity';
import { PushNotificationService } from '../../../util/services/push-notification/push-notification.service';
import { PointsService } from '../../../util/services/points/points.service';
import { And, IsNull, MoreThan, Not, Repository } from 'typeorm';
import { ImageClassifierService } from '../image-classifier/image-classifier.service';
import { ImageEntity } from '../../../database/entities/image.entity';
import { QueueService } from '../queue/queue.service';
import { EmailService } from '../email/email.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly pointsService: PointsService,
    private readonly pushNotificationService: PushNotificationService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly imageClassifierService: ImageClassifierService,
    @InjectRepository(ImageEntity)
    private readonly imageRepo: Repository<ImageEntity>,
    private readonly queueService: QueueService,
    private readonly emailService: EmailService,
  ) {}

  @Cron('0 0 0 1 * *')
  async monthlyRaffle() {
    const users = await this.userRepo.find({
      where: { placementPoints: And(Not(IsNull()), MoreThan(0)) },
    });

    const basket = users
      .map((u) => Array(u.placementPoints).fill(u.userId))
      .reduce((prev, curr) => {
        prev.push(...curr);
        return prev;
      }, []);

    const winnnerIndex = Math.floor(Math.random() * basket.length);
    const winner = users.find((u) => u.userId === basket[winnnerIndex]);

    this.pushNotificationService.sendNotification(
      {
        body:
          `Du hast die große Verlosung diesen Monat gewonnen mit ${winner.placementPoints} ${winner.placementPoints === 1 ? 'Punkt' : 'Punkten'} ` +
          `und erhältst einen Amazon-Gutschein im Wert von 50€, weiter so!`,
        title: 'Du hast gewonnen!',
        url: '/main',
      },
      [winner.userId],
    );

    const activationCode = uuidv4();
    const subject = `Du hast gewonnen!`;
    const html =
      `<h1>Du hast gewonnen!</h1><p>Du hast die große Verlosung diesen Monat gewonnen mit ${winner.placementPoints} ${winner.placementPoints === 1 ? 'Punkt' : 'Punkten'} ` +
      `und erhältst einen Amazon-Gutschein im Wert von 50€, weiter so!. Dein Gutscheincode lautet ${activationCode}.</p><p>Dein Cash4Trash-Team</p>`;
    await this.emailService.sendMail(winner.email, subject, html);
  }

  @Cron('0 5 0 * * *')
  async updatePlacements() {
    const users = await this.pointsService.getRankingForDailyUpdate();

    for (const { placement, placementPoints, userId } of users) {
      await this.userRepo.save({ userId, placement, placementPoints });
    }

    this.pushNotificationService.sendNotification({
      body: 'Die Rankings wurden aktualisiert',
      title: 'Rankings aktualisiert',
      url: '/main/ladder',
    });

    this.logger.log('Updated placements');
  }

  // TODO_1:
  checkForFinishedRaffles() {}

  @Cron('*/10 * * * * *')
  async processImages() {
    if (!this.queueService.imageQueueIsRunning) {
      this.queueService.imageQueueIsRunning = true;

      this.logger.log('Processing imagequeue');

      while (this.queueService.imageQueue.length > 0) {
        const element = this.queueService.imageQueue.shift();
        const result = await this.imageClassifierService.classifyImage(
          element.file,
        );

        await this.imageRepo.save({
          imageId: element.imageId,
          categoryId: result.categoryId,
          amountId: result.amountId,
        });

        const image = await this.imageRepo.findOne({
          where: { imageId: element.imageId },
          relations: { category: true, amount: true },
        });

        const points = image.category.points + image.amount.points;

        this.pushNotificationService.sendNotification(
          {
            body: `Für dein hochgeladenes Foto hast du ${points} ${points === 1 ? 'Punkt' : 'Punkte'} erhalten, weiter so!`,
            title: 'Punkte erhalten!',
            url: '/main/ladder',
          },
          [element.userId],
        );

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      this.queueService.imageQueueIsRunning = false;

      this.logger.log('Processing imagequeue ended');
    }
  }
}
