import { IPostBuyProductAttributes } from '@shared/post-buy-product.attributes';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PostBuyProductDto implements IPostBuyProductAttributes {
  @IsNumber()
  @Type(() => Number)
  productId: number;

  @IsNumber()
  @Type(() => Number)
  date: number;
}
