import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { IPostRegisterAttributes as IPostRegisterAttributes } from '@shared/post-register.attributes';
import { GMAIL_DOMAINS } from '@shared/constants';

export class RegisterDto implements IPostRegisterAttributes {
  @IsString()
  invitationCode: string;

  @IsEmail({ host_blacklist: GMAIL_DOMAINS })
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}
