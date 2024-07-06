import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from '../../../../database/entities/user.entity';
import { In, Like, Repository } from 'typeorm';
import { PutProfileDto } from '../dto/put-profile.dto';
import { PutShowPositionDto } from '../dto/put-show-position.dto';
import { PositionSharingEntity } from '../../../../database/entities/position-sharing.entity';
import { PostPositionSharedDto } from '../dto/post-position-shared.dto';
import { DeletePositionSharedDto } from '../dto/delete-position-shared.dto';
import { GetUserQueryDto } from '../dto/get-user-query.dto';
import { EUserRoles } from '@shared/user-roles.enum';
import { PutUserProfileDto } from '../dto/put-user-profile.dto';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(PositionSharingEntity)
    private readonly positionSharedRepo: Repository<PositionSharingEntity>,
  ) {}

  getProfile(userId: number) {
    return this.userRepo.findOne({
      select: {
        profileImage: true,
        city: true,
        username: true,
        email: true,
        showPosition: true,
      },
      where: { userId },
    });
  }

  async getUserProfile(userId: number) {
    const user = await this.userRepo.findOne({
      select: {
        profileImage: true,
        city: true,
        username: true,
        userRole: true,
        disabled: true,
      },
      where: { userId },
    });

    if (user.userRole === EUserRoles.ADMIN) {
      throw new BadRequestException();
    }

    return user;
  }

  async deleteProfileImage(userId: number) {
    await this.userRepo.save({ userId, profileImage: null });
  }

  getUser(query: GetUserQueryDto) {
    return this.userRepo.find({
      select: { email: true, userId: true },
      where: { email: Like(`%${query.search}%`) },
      take: 10,
    });
  }

  async updateUserProfile(userId: number, body: PutUserProfileDto) {
    const userEntity = plainToInstance(UserEntity, body);
    userEntity.userId = userId;
    await this.userRepo.save(userEntity);
  }

  async updateShowPosition(userId: number, body: PutShowPositionDto) {
    await this.userRepo.save({ userId, showPosition: body.showPosition });
  }

  async updateProfile(userId: number, body: PutProfileDto) {
    const userEntity = plainToInstance(UserEntity, body);
    userEntity.userId = userId;
    await this.userRepo.save(userEntity);
  }

  getPositionShared(userId: number) {
    return this.positionSharedRepo.find({
      select: {
        positionSharingId: true,
        sharedForUser: { email: true },
      },
      where: { sharedByUserId: userId },
      relations: { sharedForUser: true },
    });
  }

  async postPositionShared(userId: number, body: PostPositionSharedDto) {
    const sharedForUser = await this.userRepo.findOne({
      where: { email: body.email },
    });

    if (!sharedForUser) {
      throw new BadRequestException();
    }

    await this.positionSharedRepo.save({
      sharedByUserId: userId,
      sharedForUserId: sharedForUser.userId,
    });

    return this.getPositionShared(userId);
  }

  async deletePositionShared(
    queryParams: DeletePositionSharedDto,
    userId: number,
  ) {
    const result = await this.positionSharedRepo.delete({
      positionSharingId: In(queryParams.positionSharingIds),
      sharedByUserId: userId,
    });

    if (queryParams.positionSharingIds.length > result.affected) {
      this.logger.warn(
        `User ${userId} unsuccessfully tried to delete positionSharingIds: ${queryParams.positionSharingIds}`,
      );
      throw new BadRequestException();
    }
  }
}
