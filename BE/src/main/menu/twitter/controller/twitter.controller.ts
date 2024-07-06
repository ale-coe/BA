import { Body, Controller, Get, Post } from '@nestjs/common';
import { TwitterService } from '../service/twitter.service';
import { UserId } from '../../../../auth/decorators/user-id.decorator';
import { PostTweetDto } from '../dto/post-tweet.dto';
import { PostConnectAccountDto } from '../dto/post-connect-account.dto';

@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @Get('account-connected')
  getAccountConnected(@UserId() userId: number) {
    return this.twitterService.getAccountConnected(userId);
  }

  @Get('login-url')
  getLoginUrl(@UserId() userId: number) {
    return this.twitterService.getLoginUrl(userId);
  }

  @Post('connect-account')
  connectAccount(
    @UserId() userId: number,
    @Body() body: PostConnectAccountDto,
  ) {
    return this.twitterService.requestAccessToken(userId, body.pin);
  }

  @Post()
  postTweet(@UserId() userId: number, @Body() body: PostTweetDto) {
    return this.twitterService.postTweet(userId, body);
  }
}
