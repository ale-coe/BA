import { Test, TestingModule } from '@nestjs/testing';
import { PositionSharingEntity } from '../../../../database/entities/position-sharing.entity';
import { UserEntity } from '../../../../database/entities/user.entity';
import { ProfileService } from './profile.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: getRepositoryToken(UserEntity), useValue: {} },
        { provide: getRepositoryToken(PositionSharingEntity), useValue: {} },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
