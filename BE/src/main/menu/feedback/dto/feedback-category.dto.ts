import { IFeedbackCategoryAttributes } from '@shared/feedback-category.attributes';
import { IsNumber } from 'class-validator';

export class FeedbackCategoryDto implements IFeedbackCategoryAttributes {
  @IsNumber()
  feedbackCategoryId: number;
}
