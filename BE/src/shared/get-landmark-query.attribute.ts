import { IPaginationAttributes } from './pagination.attributes';

export interface IGetLandmarkQueryAttributes extends IPaginationAttributes {
  isEvent: number;
  includeInactive: number;
}
