import { IPutProductAttributes } from '@shared/put-product.attributes';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PutProductDto implements IPutProductAttributes {
  @IsNumber()
  @Type(() => Number)
  hidden: number;

  @IsNumber()
  @Type(() => Number)
  productId: number;
}
