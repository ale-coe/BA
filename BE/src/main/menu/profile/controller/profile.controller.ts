import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserId } from '../../../../auth/decorators/user-id.decorator';
import { DeletePositionSharedDto } from '../dto/delete-position-shared.dto';
import { PostPositionSharedDto } from '../dto/post-position-shared.dto';
import { PutProfileDto } from '../dto/put-profile.dto';
import { PutShowPositionDto } from '../dto/put-show-position.dto';
import { ProfileService } from '../services/profile.service';
import { AdminGuard } from '../../../../auth/guard/admin.guard';
import { GetUserQueryDto } from '../dto/get-user-query.dto';
import { PutUserProfileDto } from '../dto/put-user-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AdminGuard)
  @Get('user')
  getUser(@Query() query: GetUserQueryDto) {
    return this.profileService.getUser(query);
  }

  @UseGuards(AdminGuard)
  @Get('user/:userId/profile')
  getUserProfile(@Param('userId') userId: number) {
    return this.profileService.getUserProfile(userId);
  }

  @UseGuards(AdminGuard)
  @Put('user/:userId/profile')
  async updateUserProfile(
    @Param('userId') userId: number,
    @Body() body: PutUserProfileDto,
  ) {
    await this.profileService.updateUserProfile(userId, body);
  }

  @UseGuards(AdminGuard)
  @Delete('user/:userId/profile-image')
  async deleteProfileImage(@Param('userId') userId: number) {
    await this.profileService.deleteProfileImage(userId);
  }

  @Get()
  getProfile(@UserId() userId: number) {
    return this.profileService.getProfile(userId);
  }

  @Get('position-shared')
  getPositionShared(@UserId() userId: number) {
    return this.profileService.getPositionShared(userId);
  }

  @Put('show-position')
  async updateShowPosition(
    @UserId() userId: number,
    @Body() body: PutShowPositionDto,
  ) {
    await this.profileService.updateShowPosition(userId, body);
  }

  @Put()
  async updateProfile(@UserId() userId: number, @Body() body: PutProfileDto) {
    await this.profileService.updateProfile(userId, body);
  }

  @Post('position-shared')
  postPositionShared(
    @UserId() userId: number,
    @Body() body: PostPositionSharedDto,
  ) {
    return this.profileService.postPositionShared(userId, body);
  }

  @Delete('position-shared')
  async deletePositionShared(
    @Query() positionSharingIds: DeletePositionSharedDto,
    @UserId() userId: number,
  ) {
    await this.profileService.deletePositionShared(positionSharingIds, userId);
  }
}
