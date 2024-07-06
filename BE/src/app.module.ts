import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { join } from 'path';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ActivatedGuard } from './auth/guard/activated.guard';
import { TokenGuard } from './auth/guard/token.guard';
import { DatabaseModule } from './database/database.module';
import { UserEntity } from './database/entities/user.entity';
import { MainModule } from './main/main.module';
import { UtilModule } from './util/util.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', '.env'),
      validationSchema: Joi.object({
        DB_PATH: Joi.string().required(),
        SUPER_SECRET: Joi.string().required(),
        EMAIL: Joi.string().email().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        URI: Joi.string().uri().required(),
        ENV: Joi.string().required(),
        FILES_PROFILE_IMAGES: Joi.string().required(),
        FILES_TRASH_IMAGES: Joi.string().required(),
        FILES_PRODUCT_IMAGES: Joi.string().required(),
        FACEBOOK_CLIENT_ID: Joi.string().required(),
        FACEBOOK_CLIENT_SECRET: Joi.string().required(),
        PUSH_PRIVATE_KEY: Joi.string().required(),
        PUSH_PUBLIC_KEY: Joi.string().required(),
        PUSH_SUBJECT: Joi.string().required(),
        PUSH_ICON_URI: Joi.string().uri().required(),
        OPEN_API_KEY: Joi.string().required(),
        TWITTER_KEY: Joi.string().required(),
        TWITTER_SECRET: Joi.string().required(),
        BACKUP_EMAIL: Joi.string().optional(),
      }),
    }),
    DatabaseModule.register(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    MainModule,
    UtilModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: TokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ActivatedGuard,
    },
  ],
})
export class AppModule {}
