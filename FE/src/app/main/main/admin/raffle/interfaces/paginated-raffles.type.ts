import { TPaginated } from 'src/app/common/interfaces/paginated.type';
import { IProduct } from '../../../menu/product/interfaces/paginated-products.type';

export interface IRaffle {
  raffleId: number;
  description: string;
  startDate: string;
  endDate: number;
  product: IProduct;
  stopped: number;
}

export type TPaginatedRaffles = TPaginated<IRaffle[]>;
