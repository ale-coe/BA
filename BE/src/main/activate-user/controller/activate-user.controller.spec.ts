import { Test, TestingModule } from '@nestjs/testing';
import { ActivateUserController } from './activate-user.controller';
import { ActivateUserService } from '../services/activate-user.service';

describe('ActivateUserController', () => {
  let controller: ActivateUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivateUserController],
      providers: [{ provide: ActivateUserService, useValue: {} }],
    }).compile();

    controller = module.get<ActivateUserController>(ActivateUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
