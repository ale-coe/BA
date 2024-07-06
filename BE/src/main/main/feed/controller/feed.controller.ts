import { Controller, Get, Query } from '@nestjs/common';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { FeedService } from '../services/feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  getFeed(@Query() body: PaginationDto) {
    return this.feedService.getFeed(body);
  }
}
