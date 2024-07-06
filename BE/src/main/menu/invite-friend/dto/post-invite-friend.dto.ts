import { IPostInviteFriendAttributes } from '@shared/post-invite-friend.attributes';
import { Type } from 'class-transformer';
import { IsEmail, IsNumber } from 'class-validator';

export class PostInviteFriendDto implements IPostInviteFriendAttributes {
  @IsEmail()
  email: string;

  @IsNumber()
  @Type(() => Number)
  invitationDate: number;
}
