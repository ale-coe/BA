import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../../../../auth/guard/admin.guard';
import { UserId } from '../../../../../auth/decorators/user-id.decorator';
import { PushNotificationService } from '../../../../../util/services/push-notification/push-notification.service';
import { PostNotificationSubscriptionDto } from '../dto/post-notification-id.dto';
import { PostPushNotificationDto } from '../dto/post-push-notification.dto';

@Controller('push-notification')
export class PushNotificationController {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  @Post()
  async setNotifisetNotificationSubscriptioncationId(
    @UserId() userId: number,
    @Body() body: PostNotificationSubscriptionDto,
  ) {
    await this.pushNotificationService.setNotificationSubscription(
      userId,
      body,
    );
  }

  @UseGuards(AdminGuard)
  @Post('send')
  async sendNotification(@Body() body: PostPushNotificationDto) {
    await this.pushNotificationService.sendNotification(body);
  }
}
