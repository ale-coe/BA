import { IFeedbackCategoryAttributes } from '@shared/feedback-category.attributes';
import { IPutFeedbackAttribute } from '@shared/put-feedback.attributes';
import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';
import { FeedbackCategoryDto } from './feedback-category.dto';

export class PutFeedbackDto implements IPutFeedbackAttribute {
  @IsNumber()
  feedbackId: number;

  @Type(() => FeedbackCategoryDto)
  @ValidateNested()
  feedbackCategory: FeedbackCategoryDto;
}
