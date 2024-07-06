import { TPaginated } from 'src/app/common/interfaces/paginated.type';

export interface IRanking {
  userId: number;
  city: string | null;
  username: string | null;
  profileImage: string | null;
  placement: number;
  placementPoints: number;
}

export type TPaginatedRanking = TPaginated<IRanking[]>;
