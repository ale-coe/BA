import { TPaginated } from 'src/app/common/interfaces/paginated.type';

export interface ITrashImage {
  uploadDate: number;
  name: string;
  imageId: number;
  hidden: number;
  user: {
    email: string;
    username: string;
  };
}

export type TPaginatedTrashImages = TPaginated<ITrashImage[]>;
