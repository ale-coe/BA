import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AmountEntity } from './entities/amount.entity';
import { BoughtProductEntity } from './entities/bought-product.entity';
import { CategoryEntity } from './entities/category.entity';
import { FeedbackCategoryEntity } from './entities/feedback-category.entity';
import { FeedbackTypesEntity } from './entities/feedback-type.entity';
import { FeedbackEntity } from './entities/feedback.entity';
import { ImageEntity } from './entities/image.entity';
import { InvitationEntity } from './entities/invitation.entity';
import { LandmarkTypeEntity } from './entities/landmark-type.entity';
import { LandmarkEntity } from './entities/landmark.entity';
import { PositionSharingEntity } from './entities/position-sharing.entity';
import { ProductEntity } from './entities/product.entity';
import { SocialMediaPostEntity } from './entities/social-media-post.entity';
import { RaffleEntity } from './entities/raffle.entity';

@Module({})
export class DatabaseModule {
  static register(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          // logging: 'all',
          database: process.env.DB_PATH,
          enableWAL: true,
          entities: [
            UserEntity,
            AmountEntity,
            BoughtProductEntity,
            CategoryEntity,
            FeedbackCategoryEntity,
            FeedbackTypesEntity,
            FeedbackEntity,
            ImageEntity,
            InvitationEntity,
            LandmarkTypeEntity,
            LandmarkEntity,
            PositionSharingEntity,
            ProductEntity,
            SocialMediaPostEntity,
            RaffleEntity,
          ],
        }),
      ],
    };
  }
}
