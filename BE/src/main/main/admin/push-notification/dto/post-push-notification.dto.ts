import { IPostPushNotificationAttributes } from '@shared/post-push-notification.attributes';
import { IsString } from 'class-validator';

export class PostPushNotificationDto
  implements IPostPushNotificationAttributes
{
  @IsString()
  url: string;

  @IsString()
  title: string;

  @IsString()
  body: string;
}
