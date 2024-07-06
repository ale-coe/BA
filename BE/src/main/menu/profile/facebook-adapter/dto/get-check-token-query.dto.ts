import { IGetCheckTokenQueryAttributes } from '@shared/get-check-token-query.attributes';
import { IsString } from 'class-validator';

export class GetCheckTokenQueryDto implements IGetCheckTokenQueryAttributes {
  @IsString()
  token: string;
}
