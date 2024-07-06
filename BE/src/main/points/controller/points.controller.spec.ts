import { Test, TestingModule } from '@nestjs/testing';
import { PointsService } from '../../../util/services/points/points.service';
import { PointsController } from './points.controller';

describe('PointsController', () => {
  let controller: PointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointsController],
      providers: [{ provide: PointsService, useValue: {} }],
    }).compile();

    controller = module.get<PointsController>(PointsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
