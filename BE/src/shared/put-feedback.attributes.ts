import { IFeedbackCategoryAttributes } from './feedback-category.attributes';

export interface IPutFeedbackAttribute {
  feedbackId: number;
  feedbackCategory: IFeedbackCategoryAttributes;
}
