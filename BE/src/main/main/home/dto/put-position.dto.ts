import { TCoords } from '@shared/coords.type';
import { IPutPositionAttributes } from '@shared/put-position.attributes';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsNumber } from 'class-validator';

export class PutPositionDto implements IPutPositionAttributes {
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @IsNumber({ allowNaN: false }, { each: true })
  @Type(() => Number)
  coords: TCoords;
}
