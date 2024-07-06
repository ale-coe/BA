import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RaffleEntity } from '../../../../../database/entities/raffle.entity';
import { RaffleService } from './raffle.service';

describe('RaffleService', () => {
  let service: RaffleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RaffleService,
        { provide: getRepositoryToken(RaffleEntity), useValue: {} },
      ],
    }).compile();

    service = module.get<RaffleService>(RaffleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
