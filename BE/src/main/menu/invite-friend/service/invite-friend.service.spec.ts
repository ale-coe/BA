import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InvitationEntity } from '../../../../database/entities/invitation.entity';
import { EmailService } from '../../../../util/services/email/email.service';
import { InviteFriendService } from './invite-friend.service';

describe('InviteFriendService', () => {
  let service: InviteFriendService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InviteFriendService,
        { provide: getRepositoryToken(InvitationEntity), useValue: {} },
        { provide: EmailService, useValue: {} },
      ],
    }).compile();

    service = module.get<InviteFriendService>(InviteFriendService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
