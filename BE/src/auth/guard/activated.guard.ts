import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { CustomRequestInterface } from '../../interfaces/custom-request.interface';
import { Repository } from 'typeorm';
import { BypassActivatedGuard } from '../decorators/bypass-activated-guard.decorator';

@Injectable()
export class ActivatedGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const bypassActivatedGuard = this.reflector.get(
      BypassActivatedGuard,
      context.getHandler(),
    );

    if (bypassActivatedGuard) {
      return true;
    }

    const req = context.switchToHttp().getRequest<CustomRequestInterface>();
    const { userId } = req;

    if (!userId) {
      return false;
    }

    const user = await this.userRepo.findOne({ where: { userId } });

    return !!user.activated;
  }
}
