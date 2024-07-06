import { IPaginationAttributes } from '@shared/pagination.attributes';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, Max } from 'class-validator';

export class PaginationDto implements IPaginationAttributes {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  take = 10;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  skip = 0;
}
