import { IPostConnectAccountAttributes } from '@shared/post-conntect-account.attributes';
import { IsString } from 'class-validator';

export class PostConnectAccountDto implements IPostConnectAccountAttributes {
  @IsString()
  pin: string;
}
