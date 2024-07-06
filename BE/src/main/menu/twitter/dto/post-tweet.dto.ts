import { IPostTweetAttributes } from '@shared/post-tweet.attributes';
import { IsNumber, IsString } from 'class-validator';

export class PostTweetDto implements IPostTweetAttributes {
  @IsString()
  tweet: string;
}
