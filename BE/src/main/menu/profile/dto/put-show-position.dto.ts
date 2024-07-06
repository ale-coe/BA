import { IPutShowPositionAttributes } from '@shared/put-show-position.attributes';
import { IsNumber } from 'class-validator';

export class PutShowPositionDto implements IPutShowPositionAttributes {
  @IsNumber()
  showPosition: number;
}
