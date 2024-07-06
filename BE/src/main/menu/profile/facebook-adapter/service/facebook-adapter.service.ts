import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { lastValueFrom, map, switchMap, tap } from 'rxjs';
import { GetCheckTokenQueryDto } from '../dto/get-check-token-query.dto';

// get single post https://developers.facebook.com/docs/graph-api/reference/page-post/#Creating

// Post to feed: https://developers.facebook.com/docs/graph-api/reference/page/feed#publish
// needs page permissions like in https://www.youtube.com/watch?v=3HvzgDzrG0c
// https://developers.facebook.com/tools/explorer/?method=GET&path=122098481036315554%2Ffeed&version=v19.0

@Injectable()
export class FacebookAdapterService {
  private logger = new Logger(FacebookAdapterService.name);

  constructor(private readonly httpService: HttpService) {}

  async checkToken(query: GetCheckTokenQueryDto) {
    try {
      // https://developers.facebook.com/docs/facebook-login/guides/access-tokens#erstellen-eines-app-zugriffsschl-ssels
      const result = await lastValueFrom(
        this.httpService
          .get<{ access_token: string; token_type: 'bearer' }>(
            'https://graph.facebook.com/oauth/access_token',
            {
              params: {
                client_id: process.env.FACEBOOK_CLIENT_ID,
                client_secret: process.env.FACEBOOK_CLIENT_SECRET,
                grant_type: 'client_credentials',
              },
            },
          )
          .pipe(
            map(({ data }) => data),
            // https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow#checktoken
            switchMap(({ access_token }) =>
              this.httpService.get<{ data: { user_id: string } }>(
                'https://graph.facebook.com/debug_token',
                {
                  params: { input_token: query.token, access_token },
                },
              ),
            ),
            map(({ data }) => data.data),
            // https://developers.facebook.com/docs/graph-api/reference/v19.0/user/posts
            // alternativ: https://developers.facebook.com/docs/graph-api/reference/page/feed#read  (page-id) -> first part of id of post, contains post route, too
            switchMap(({ user_id }) => {
              return this.httpService.get(
                `https://graph.facebook.com/v19.0/${user_id}/posts`,
                {
                  params: {
                    access_token: query.token,
                  },
                },
              );
            }),
          ),
        // TODO_1: check userId with supplied userId and app id
      );
    } catch (error) {
      this.logger.warn(error);
      throw new UnauthorizedException();
    }
  }
}
