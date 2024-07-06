import { Test, TestingModule } from '@nestjs/testing';
import { LandmarkService } from '../services/landmark.service';
import { LandmarkController } from './landmark.controller';

describe('LandmarkController', () => {
  let controller: LandmarkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LandmarkController],
      providers: [{ provide: LandmarkService, useValue: {} }],
    }).compile();

    controller = module.get<LandmarkController>(LandmarkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
