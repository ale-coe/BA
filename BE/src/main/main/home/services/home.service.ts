import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PositionSharingEntity } from '../../../../database/entities/position-sharing.entity';
import { UserEntity } from '../../../../database/entities/user.entity';
import { Repository } from 'typeorm';
import { PutPositionDto } from '../dto/put-position.dto';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(PositionSharingEntity)
    private readonly positionSharingRepo: Repository<PositionSharingEntity>,
  ) {}

  getSharedPositions(userId: number) {
    return this.positionSharingRepo.find({
      select: {
        positionSharingId: true,
        sharedByUser: {
          city: true,
          username: true,
          profileImage: true,
          position: true,
          userId: true,
        },
      },
      where: { sharedForUserId: userId, sharedByUser: { showPosition: 1 } },
      relations: { sharedByUser: true },
    });
  }

  async getPositionShared(userId: number) {
    const user = await this.userRepo.findOne({
      select: { showPosition: true },
      where: { userId },
    });

    if (!user) {
      throw new BadRequestException();
    }

    return !!user.showPosition;
  }

  async updatePosition(userId: number, body: PutPositionDto) {
    await this.userRepo.save({ userId, position: JSON.stringify(body.coords) });
  }
}
