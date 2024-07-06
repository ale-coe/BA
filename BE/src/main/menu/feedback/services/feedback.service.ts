import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { FeedbackCategoryEntity } from '../../../../database/entities/feedback-category.entity';
import { FeedbackTypesEntity } from '../../../../database/entities/feedback-type.entity';
import { FeedbackEntity } from '../../../../database/entities/feedback.entity';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { Repository } from 'typeorm';
import { PostFeedbackDto } from '../dto/post-feedback.dto';
import { PutFeedbackDto } from '../dto/put-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackCategoryEntity)
    private readonly feedbackCategoryRepo: Repository<FeedbackCategoryEntity>,
    @InjectRepository(FeedbackTypesEntity)
    private readonly feedbackTypeRepo: Repository<FeedbackTypesEntity>,
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepo: Repository<FeedbackEntity>,
  ) {}

  getFeedbackCategories() {
    return this.feedbackCategoryRepo.find();
  }

  getFeedbackTypes() {
    return this.feedbackTypeRepo.find();
  }

  getFeedback(query: PaginationDto) {
    return this.feedbackRepo.findAndCount({
      select: {
        feedbackId: true,
        date: true,
        feedbackType: { label: true },
        feedbackCategory: { feedbackCategoryId: true, label: true },
        user: { userId: true, email: true, username: true },
        text: true,
      },
      skip: query.skip,
      take: query.take,
      relations: { feedbackType: true, feedbackCategory: true, user: true },
      order: { feedbackId: 'DESC' },
    });
  }

  async updateFeedback(feedback: PutFeedbackDto) {
    const feedbackEntity = plainToInstance(FeedbackEntity, feedback, {
      enableImplicitConversion: true,
    });
    await this.feedbackRepo.save(feedbackEntity);
  }

  async postFeedback(feedback: PostFeedbackDto, userId: number) {
    const feedbackEntity = plainToInstance(FeedbackEntity, feedback);
    feedbackEntity.userId = userId;
    feedbackEntity.date = Date.now();
    await this.feedbackRepo.save(feedbackEntity);
  }
}
