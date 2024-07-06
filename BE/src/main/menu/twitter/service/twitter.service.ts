import { BadRequestException, Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { PostTweetDto } from '../dto/post-tweet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../../database/entities/user.entity';
import { Repository } from 'typeorm';
import { SocialMediaPostEntity } from '../../../../database/entities/social-media-post.entity';
const OAuth = require('oauth-1.0a');

@Injectable()
export class TwitterService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(SocialMediaPostEntity)
    private readonly socialMediaPostRepo: Repository<SocialMediaPostEntity>,
  ) {}
  private oathContainer: any = {};

  async getAccountConnected(userId: number) {
    const user = await this.userRepo.findOne({ where: { userId } });

    if (!user) {
      throw new BadRequestException();
    }

    return !!user.connectedTwitterAccount;
  }

  async getLoginUrl(userId: number) {
    const oauth = OAuth({
      consumer: {
        key: process.env.TWITTER_KEY,
        secret: process.env.TWITTER_SECRET,
      },
      signature_method: 'HMAC-SHA1',
      hash_function: (baseString, key) =>
        createHmac('sha1', key).update(baseString).digest('base64'),
    });

    const requestTokenURL =
      'https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write';
    const authHeader = oauth.toHeader(
      oauth.authorize({
        url: requestTokenURL,
        method: 'POST',
      }),
    );

    const result = await lastValueFrom(
      this.httpService.post(requestTokenURL, undefined, {
        headers: { Authorization: authHeader['Authorization'] },
      }),
    );

    const oAuthRequestToken = Object.fromEntries(
      new URLSearchParams(result.data),
    );

    this.oathContainer[userId] = oAuthRequestToken;

    return `https://api.twitter.com/oauth/authorize?oauth_token=${oAuthRequestToken.oauth_token}`;
  }

  async postTweet(userId: number, body: PostTweetDto) {
    const user = await this.userRepo.findOne({ where: { userId } });

    if (!user) {
      throw new BadRequestException();
    }

    const { oauth_token, oauth_token_secret } = Object.fromEntries(
      new URLSearchParams(user.connectedTwitterAccount),
    );

    const token = {
      key: oauth_token,
      secret: oauth_token_secret,
    };
    const oauth = OAuth({
      consumer: {
        key: process.env.TWITTER_KEY,
        secret: process.env.TWITTER_SECRET,
      },
      signature_method: 'HMAC-SHA1',
      hash_function: (baseString, key) =>
        createHmac('sha1', key).update(baseString).digest('base64'),
    });
    const url = 'https://api.twitter.com/2/tweets';
    const headers = oauth.toHeader(
      oauth.authorize(
        {
          url,
          method: 'POST',
        },
        token,
      ),
    );
    const result = await lastValueFrom(
      this.httpService.post(
        url,
        { text: body.tweet },
        {
          headers: {
            Authorization: headers['Authorization'],
            'content-type': 'application/json',
            accept: 'application/json',
          },
        },
      ),
    );

    await this.socialMediaPostRepo.save({
      userId,
      postContent: result.data.data.text,
      postDate: Date.now(),
      postId: result.data.data.id,
    });
  }

  public async requestAccessToken(userId: number, pin: string) {
    const url = `https://api.twitter.com/oauth/access_token?oauth_verifier=${pin}&oauth_token=${this.oathContainer[userId].oauth_token}`;
    const oauth = OAuth({
      consumer: {
        key: process.env.TWITTER_KEY,
        secret: process.env.TWITTER_SECRET,
      },
      signature_method: 'HMAC-SHA1',
      hash_function: (baseString, key) =>
        createHmac('sha1', key).update(baseString).digest('base64'),
    });

    const authHeader = oauth.toHeader(
      oauth.authorize({
        url,
        method: 'POST',
      }),
    );

    const result = await lastValueFrom(
      this.httpService.post(url, undefined, {
        headers: { Authorization: authHeader['Authorization'] },
      }),
    );

    await this.userRepo.save({ userId, connectedTwitterAccount: result.data });
  }
}
