import { IPutTrashImageAttributes } from '@shared/put-trash-image.attributes';
import { IsNumber } from 'class-validator';

export class PutTrashImageDto implements IPutTrashImageAttributes {
  @IsNumber({ allowNaN: false })
  imageId: number;

  @IsNumber({ allowNaN: false })
  hidden: number;
}
