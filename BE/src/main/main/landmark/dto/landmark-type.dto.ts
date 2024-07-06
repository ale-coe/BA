import { IsNumber } from 'class-validator';

export class LandmarkTypeDto {
  @IsNumber()
  landmarkTypeId: number;
}
