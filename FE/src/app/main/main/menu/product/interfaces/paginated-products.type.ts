import { TPaginated } from 'src/app/common/interfaces/paginated.type';

export interface IProduct {
  productId: number;
  imagePath: string;
  name: string;
  hidden: number;
  price: number;
}

export type TPaginatedProducts = TPaginated<IProduct[]>;
