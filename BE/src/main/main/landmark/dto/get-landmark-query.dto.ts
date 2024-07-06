import { IGetLandmarkQueryAttributes } from '@shared/get-landmark-query.attribute';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { PaginationDto } from '@shared/dto/pagination.dto';

export class GetLandmarkQueryDto
  extends PaginationDto
  implements IGetLandmarkQueryAttributes
{
  @IsNumber()
  @Type(() => Number)
  isEvent: number;

  @IsNumber()
  @Type(() => Number)
  includeInactive: number;
}
