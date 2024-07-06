import { TCoords } from '@shared/coords.type';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LandmarkTypeDto } from './landmark-type.dto';

export class PostLandmarkDto {
  @IsString()
  name: string;

  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  @IsNumber({ allowNaN: false }, { each: true })
  @Type(() => Number)
  position: TCoords;

  @IsNumber()
  @Type(() => Number)
  showFrom: number;

  @IsNumber()
  @Type(() => Number)
  showUntil: number;

  @IsString()
  additionalInfo: string;

  @Type(() => LandmarkTypeDto)
  @ValidateNested()
  landmarkType: LandmarkTypeDto;
}
