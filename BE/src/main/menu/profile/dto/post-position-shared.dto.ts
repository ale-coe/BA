import { IPostPositionSharedAttributes } from '@shared/post-position-shared.attributes';
import { IsEmail } from 'class-validator';

export class PostPositionSharedDto implements IPostPositionSharedAttributes {
  @IsEmail()
  email: string;
}
