import { EMarkerType } from '../../../interfaces/marker-type.enum';

export interface ITooltipContent {
  src: string | [string, string, string, string];
  text: string;
  loadingProfileImage: boolean;
}
