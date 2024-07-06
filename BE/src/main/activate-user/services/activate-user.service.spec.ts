import { Test, TestingModule } from '@nestjs/testing';
import { ActivateUserService } from './activate-user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../../database/entities/user.entity';

describe('ActivateUserService', () => {
  let service: ActivateUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivateUserService,
        { provide: getRepositoryToken(UserEntity), useValue: {} },
      ],
    }).compile();

    service = module.get<ActivateUserService>(ActivateUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
