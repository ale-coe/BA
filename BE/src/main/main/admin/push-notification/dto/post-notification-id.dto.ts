import {
  IKeysAttributes,
  IPostNotificationSubscriptionAttributes,
} from '@shared/post-notification-id.attributes';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class KeysAttributeDto implements IKeysAttributes {
  @IsString()
  @IsNotEmpty()
  p256dh: string;

  @IsString()
  @IsNotEmpty()
  auth: string;
}

export class PostNotificationSubscriptionDto
  implements IPostNotificationSubscriptionAttributes
{
  @IsString()
  endpoint: string;

  @IsNumber()
  @ValidateIf((_object, value) => value !== null)
  expirationTime: null | number;

  @ValidateNested()
  @Type(() => KeysAttributeDto)
  keys: KeysAttributeDto;
}
