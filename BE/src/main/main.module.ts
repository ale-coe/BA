import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoughtProductEntity } from '../database/entities/bought-product.entity';
import { FeedbackCategoryEntity } from '../database/entities/feedback-category.entity';
import { FeedbackTypesEntity } from '../database/entities/feedback-type.entity';
import { FeedbackEntity } from '../database/entities/feedback.entity';
import { ImageEntity } from '../database/entities/image.entity';
import { InvitationEntity } from '../database/entities/invitation.entity';
import { LandmarkTypeEntity } from '../database/entities/landmark-type.entity';
import { LandmarkEntity } from '../database/entities/landmark.entity';
import { PositionSharingEntity } from '../database/entities/position-sharing.entity';
import { ProductEntity } from '../database/entities/product.entity';
import { SocialMediaPostEntity } from '../database/entities/social-media-post.entity';
import { UserEntity } from '../database/entities/user.entity';
import { PointsService } from '../util/services/points/points.service';
import { ActivateUserController } from './activate-user/controller/activate-user.controller';
import { ActivateUserService } from './activate-user/services/activate-user.service';
import { FileHelperController } from './file-helper/controller/file-helper.controller';
import { FileHelperService } from './file-helper/services/file-helper.service';
import { PushNotificationController } from './main/admin/push-notification/controller/push-notification.controller';
import { TrashImageController } from './main/admin/trash-image/controller/trash-image.controller';
import { TrashImageService } from './main/admin/trash-image/service/trash-image.service';
import { HomeController } from './main/home/controller/home.controller';
import { LandmarkController } from './main/landmark/controller/landmark.controller';
import { LandmarkService } from './main/landmark/services/landmark.service';
import { HomeService } from './main/home/services/home.service';
import { FeedbackController } from './menu/feedback/controller/feedback.controller';
import { FeedbackService } from './menu/feedback/services/feedback.service';
import { InviteFriendController } from './menu/invite-friend/controller/invite-friend.controller';
import { InviteFriendService } from './menu/invite-friend/service/invite-friend.service';
import { ProductsController } from './menu/products/controller/products.controller';
import { ProductsService } from './menu/products/services/products.service';
import { ProfileController } from './menu/profile/controller/profile.controller';
import { FacebookAdapterController } from './menu/profile/facebook-adapter/controller/facebook-adapter.controller';
import { FacebookAdapterService } from './menu/profile/facebook-adapter/service/facebook-adapter.service';
import { ProfileService } from './menu/profile/services/profile.service';
import { PointsController } from './points/controller/points.controller';

import { AmountEntity } from '../database/entities/amount.entity';
import { CategoryEntity } from '../database/entities/category.entity';
import { UtilModule } from '../util/util.module';
import { RaffleService } from './main/admin/raffle/controller/raffle.service';
import { RaffleEntity } from '../database/entities/raffle.entity';
import { RaffleController } from './main/admin/raffle/raffle.controller';
import { TwitterController } from './menu/twitter/controller/twitter.controller';
import { TwitterService } from './menu/twitter/service/twitter.service';
import { FeedController } from './main/feed/controller/feed.controller';
import { FeedService } from './main/feed/services/feed.service';

@Module({
  controllers: [
    FeedbackController,
    ProfileController,
    FileHelperController,
    ActivateUserController,
    HomeController,
    TrashImageController,
    LandmarkController,
    ProductsController,
    PointsController,
    InviteFriendController,
    FacebookAdapterController,
    PushNotificationController,
    RaffleController,
    TwitterController,
    FeedController,
  ],
  imports: [
    TypeOrmModule.forFeature([
      FeedbackEntity,
      FeedbackCategoryEntity,
      FeedbackTypesEntity,
      PositionSharingEntity,
      UserEntity,
      ImageEntity,
      LandmarkTypeEntity,
      LandmarkEntity,
      ProductEntity,
      BoughtProductEntity,
      InvitationEntity,
      SocialMediaPostEntity,
      AmountEntity,
      CategoryEntity,
      RaffleEntity,
    ]),
    HttpModule,
    UtilModule,
  ],
  providers: [
    FeedbackService,
    ProfileService,
    FileHelperService,
    ActivateUserService,
    HomeService,
    TrashImageService,
    LandmarkService,
    ProductsService,
    PointsService,
    InviteFriendService,
    FacebookAdapterService,
    RaffleService,
    TwitterService,
    FeedService,
  ],
})
export class MainModule {}
