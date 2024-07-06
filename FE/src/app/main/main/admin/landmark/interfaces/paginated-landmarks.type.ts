import { TPaginated } from 'src/app/common/interfaces/paginated.type';
import { ILandmark } from '../../../home/interfaces/landmark.interface';

export type TPaginatedLandmarks = TPaginated<ILandmark[]>;
