import { IPutLandmarkAttributes } from '@shared/put-landmark.attributes';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class PutLandmarkDto implements IPutLandmarkAttributes {
  @IsNumber()
  @Type(() => Number)
  showFrom: number;

  @IsNumber()
  @Type(() => Number)
  landmarkId: number;

  @IsNumber()
  @Type(() => Number)
  showUntil: number;
}
