import { IPutProfileAttributes } from '@shared/put-profile.attributes';
import { IsEmail, IsString } from 'class-validator';

export class PutProfileDto implements IPutProfileAttributes {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  city: string;
}
