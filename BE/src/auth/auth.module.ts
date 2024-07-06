import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationEntity } from '../database/entities/invitation.entity';
import { UserEntity } from '../database/entities/user.entity';
import { UtilModule } from '../util/util.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, InvitationEntity]),
    UtilModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
