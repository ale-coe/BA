import { IGetLandmarkTypesQueryAttributes } from '@shared/get-landmark-types-query.attributes';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetLandmarkTypesQueryDto
  implements IGetLandmarkTypesQueryAttributes
{
  @Type(() => Number)
  @IsNumber()
  isEvent: number;
}
