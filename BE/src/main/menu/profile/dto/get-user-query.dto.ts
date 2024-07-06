import { IGetUserQueryAttributes } from '@shared/get-user-query.attributes';
import { IsString } from 'class-validator';

export class GetUserQueryDto implements IGetUserQueryAttributes {
  @IsString()
  search: string;
}
