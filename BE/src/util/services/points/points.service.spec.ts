import { Test, TestingModule } from '@nestjs/testing';
import { PointsService } from './points.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../../database/entities/user.entity';
import { DataSource } from 'typeorm';

describe('PointsService', () => {
  let service: PointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointsService,
        { provide: getRepositoryToken(UserEntity), useValue: {} },
        { provide: DataSource, useValue: {} },
      ],
    }).compile();

    service = module.get<PointsService>(PointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
