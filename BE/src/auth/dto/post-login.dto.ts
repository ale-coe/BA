import { IPostLoginAttributes } from '@shared/post-login.attributes';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto implements IPostLoginAttributes {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
