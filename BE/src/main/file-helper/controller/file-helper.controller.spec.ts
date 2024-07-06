import { Test, TestingModule } from '@nestjs/testing';
import { FileHelperController } from './file-helper.controller';
import { FileHelperService } from '../services/file-helper.service';

describe('FileHelperController', () => {
  let controller: FileHelperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileHelperController],
      providers: [{ provide: FileHelperService, useValue: {} }],
    }).compile();

    controller = module.get<FileHelperController>(FileHelperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
