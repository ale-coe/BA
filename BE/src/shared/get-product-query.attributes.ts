import { IPaginationAttributes } from './pagination.attributes';

export interface IGetProductQueryAttributes extends IPaginationAttributes {
  includeHidden: number;
}
