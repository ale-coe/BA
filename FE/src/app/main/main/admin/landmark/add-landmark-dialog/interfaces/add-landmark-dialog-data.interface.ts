import { ILandmarkType } from './landmark-type.interface';

export interface IAddLandmarkDialogData {
  landmarkTypes: ILandmarkType[];
  isEvent: boolean;
}
