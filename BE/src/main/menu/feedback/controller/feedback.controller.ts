import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FeedbackService } from '../services/feedback.service';
import { PostFeedbackDto } from '../dto/post-feedback.dto';
import { UserId } from '../../../../auth/decorators/user-id.decorator';
import { AdminGuard } from '../../../../auth/guard/admin.guard';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { PutFeedbackDto } from '../dto/put-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackSerivce: FeedbackService) {}

  @UseGuards(AdminGuard)
  @Get()
  getFeedback(@Query() query: PaginationDto) {
    return this.feedbackSerivce.getFeedback(query);
  }

  @Get('types')
  getFeedbackTypes() {
    return this.feedbackSerivce.getFeedbackTypes();
  }

  @Get('categories')
  getFeedbackCategories() {
    return this.feedbackSerivce.getFeedbackCategories();
  }

  @UseGuards(AdminGuard)
  @Put()
  async updateFeedback(@Body() feedback: PutFeedbackDto) {
    await this.feedbackSerivce.updateFeedback(feedback);
  }

  @Post()
  async postFeedback(
    @Body() feedback: PostFeedbackDto,
    @UserId() userId: number,
  ) {
    await this.feedbackSerivce.postFeedback(feedback, userId);
  }
}
