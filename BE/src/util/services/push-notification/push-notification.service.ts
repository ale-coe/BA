import { Injectable } from '@nestjs/common';
import { PostNotificationSubscriptionDto } from '../../../main/main/admin/push-notification/dto/post-notification-id.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../database/entities/user.entity';
import { In, IsNull, Not, Repository } from 'typeorm';
import { setVapidDetails, sendNotification } from 'web-push';
import { PostPushNotificationDto } from '../../../main/main/admin/push-notification/dto/post-push-notification.dto';

@Injectable()
export class PushNotificationService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {
    setVapidDetails(
      process.env.PUSH_SUBJECT,
      process.env.PUSH_PUBLIC_KEY,
      process.env.PUSH_PRIVATE_KEY,
    );
  }

  async setNotificationSubscription(
    userId: number,
    body: PostNotificationSubscriptionDto,
  ) {
    await this.userRepo.save({ userId, notificationId: JSON.stringify(body) });
  }

  async sendNotification(
    { body, title, url }: PostPushNotificationDto,
    userIds: number[] = [],
  ) {
    const users = await this.userRepo.find({
      select: { notificationId: true },
      where: {
        notificationId: Not(IsNull()),
        userId: userIds.length ? In(userIds) : Not(IsNull()),
      },
    });

    for (const user of users) {
      sendNotification(
        JSON.parse(user.notificationId),
        JSON.stringify({
          notification: {
            icon: process.env.PUSH_ICON_URI,
            title,
            body,
            data: {
              onActionClick: {
                default: { operation: 'openWindow', url },
              },
            },
          },
        }),
      );
    }
  }
}
