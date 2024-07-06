import { Test, TestingModule } from '@nestjs/testing';
import { FacebookAdapterService } from '../service/facebook-adapter.service';
import { FacebookAdapterController } from './facebook-adapter.controller';

describe('FacebookAdapterController', () => {
  let controller: FacebookAdapterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacebookAdapterController],
      providers: [{ provide: FacebookAdapterService, useValue: {} }],
    }).compile();

    controller = module.get<FacebookAdapterController>(
      FacebookAdapterController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
