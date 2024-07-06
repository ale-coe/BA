import { Test, TestingModule } from '@nestjs/testing';
import { InviteFriendService } from '../service/invite-friend.service';
import { InviteFriendController } from './invite-friend.controller';

describe('InviteFriendController', () => {
  let controller: InviteFriendController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InviteFriendController],
      providers: [{ provide: InviteFriendService, useValue: {} }],
    }).compile();

    controller = module.get<InviteFriendController>(InviteFriendController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
