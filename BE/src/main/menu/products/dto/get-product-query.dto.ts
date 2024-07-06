import { IGetProductQueryAttributes } from '@shared/get-product-query.attributes';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { PaginationDto } from '@shared/dto/pagination.dto';

export class GetProductQueryDto
  extends PaginationDto
  implements IGetProductQueryAttributes
{
  @IsNumber()
  @Type(() => Number)
  includeHidden: number;
}
