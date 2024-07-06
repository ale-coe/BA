import { TPaginated } from 'src/app/common/interfaces/paginated.type';
import { IFeedbackCategory } from '../../../menu/feedback/interfaces/feeback-category.interface';

export interface IFeedback {
  feedbackId: number;
  date: number;
  feedbackType: { label: string };
  feedbackCategory?: IFeedbackCategory;
  user: { userId: number; email: string; username: string };
  text: string;
}

export type TPaginatedFeedback = TPaginated<IFeedback[]>;
