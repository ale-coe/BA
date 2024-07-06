import { TCoords } from '@shared/coords.type';

export interface ILandmark {
  landmarkId: number;
  name: string;
  position: TCoords;
  landmarkType: { label: true; landmarkTypeId: number };
  additionalInfo: string;
  showFrom: number;
  showUntil: number;
}
