import { IPostProductAttributes } from '@shared/post-product.attributes';
import { IsNumber, IsString } from 'class-validator';

export class PostProductDto implements IPostProductAttributes {
  @IsString()
  imagePath: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;
}
