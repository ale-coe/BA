import { IDeletePositionSharedAttributes } from '@shared/delete-position-shared.attributes';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class DeletePositionSharedDto
  implements IDeletePositionSharedAttributes
{
  @Transform(({ value }) => {
    return Array.isArray(value) ? value.map(Number) : [Number(value)];
  })
  @IsNumber({ allowNaN: false }, { each: true })
  positionSharingIds: number[];
}
