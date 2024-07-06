import { IPutUserProfileAttributes } from '@shared/put-user-profile.attributes';
import { EUserRoles } from '@shared/user-roles.enum';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsString } from 'class-validator';

export class PutUserProfileDto implements IPutUserProfileAttributes {
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @IsString()
  username: string;

  @IsString()
  city: string;

  @IsIn([EUserRoles.ADMIN, EUserRoles.USER])
  userRole: EUserRoles;

  @IsNumber()
  @Type(() => Number)
  disabled: number;
}
