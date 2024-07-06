import { Test, TestingModule } from '@nestjs/testing';
import { PushNotificationService } from '../../../../../util/services/push-notification/push-notification.service';
import { PushNotificationController } from './push-notification.controller';

describe('PushNotificationController', () => {
  let controller: PushNotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PushNotificationController],
      providers: [{ provide: PushNotificationService, useValue: {} }],
    }).compile();

    controller = module.get<PushNotificationController>(
      PushNotificationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
