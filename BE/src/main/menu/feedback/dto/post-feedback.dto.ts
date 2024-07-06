import { IPostFeedbackAttributes } from '@shared/post-feedback.attributes';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PostFeedbackDto implements IPostFeedbackAttributes {
  @IsNumber()
  feedbackTypeId: number;

  @IsString()
  @IsNotEmpty()
  text: string;
}
