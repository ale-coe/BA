import { TCoords } from './coords.type';
import { ILandmarkTypeAttributes } from './landmark-type.attributes';

export interface IPostLandmarkAttributes {
  name: string;
  position: TCoords;
  showFrom: number;
  showUntil: number;
  additionalInfo: string;
  landmarkType: ILandmarkTypeAttributes;
}
