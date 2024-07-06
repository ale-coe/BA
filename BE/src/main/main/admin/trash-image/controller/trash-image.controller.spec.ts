import { Test, TestingModule } from '@nestjs/testing';
import { TrashImageService } from '../service/trash-image.service';
import { TrashImageController } from './trash-image.controller';

describe('TrashImageController', () => {
  let controller: TrashImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrashImageController],
      providers: [{ provide: TrashImageService, useValue: {} }],
    }).compile();

    controller = module.get<TrashImageController>(TrashImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
