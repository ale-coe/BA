import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { InvitationEntity } from '../../database/entities/invitation.entity';
import { EmailService } from '../../util/services/email/email.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(UserEntity), useValue: {} },
        { provide: getRepositoryToken(InvitationEntity), useValue: {} },
        { provide: EmailService, useValue: {} },
      ],
    }).compile();

    service = app.get(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
