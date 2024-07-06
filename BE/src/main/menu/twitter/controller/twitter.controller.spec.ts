import { Test, TestingModule } from '@nestjs/testing';
import { TwitterService } from '../service/twitter.service';
import { TwitterController } from './twitter.controller';

describe('TwitterController', () => {
  let controller: TwitterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwitterController],
      providers: [{ provide: TwitterService, useValue: {} }],
    }).compile();

    controller = module.get<TwitterController>(TwitterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
