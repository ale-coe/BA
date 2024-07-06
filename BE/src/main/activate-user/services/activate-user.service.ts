import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostActivateDto } from '../../../main/activate-user/dto/post-activate.dto';
import { UserEntity } from '../../../database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActivateUserService {
  private logger = new Logger(ActivateUserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async activateUser(body: PostActivateDto, userId: number) {
    const user = await this.userRepo.findOne({
      where: { userId, activationCode: body.activationCode },
    });

    if (!user) {
      this.logger.warn(
        `UserId ${userId} doesn't fit activationCode ${body.activationCode}`,
      );
      throw new BadRequestException();
    }

    user.activated = 1;
    await this.userRepo.save(user);
  }
}
