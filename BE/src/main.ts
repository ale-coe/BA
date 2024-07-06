import { NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';

const appOptionsFactory = (): NestApplicationOptions =>
  process.env.ENV === 'dev'
    ? {
        httpsOptions: {
          cert: readFileSync('../SSL/certificate.crt'),
          key: readFileSync('../SSL/privatekey.key'),
        },
      }
    : {};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    appOptionsFactory(),
  );
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://192.168.178.55:4200',
      'http://192.168.178.56:4200',
      'https://localhost:4200',
      'https://192.168.178.55:4200',
      'https://192.168.178.56:4200',
    ],
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.disable('x-powered-by');
  await app.listen(4000, '0.0.0.0');
}
bootstrap();
