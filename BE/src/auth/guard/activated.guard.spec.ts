import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { ActivatedGuard } from './activated.guard';

describe('ActivatedGuard', () => {
  let guard: ActivatedGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: Reflector, useValue: {} },
        { provide: getRepositoryToken(UserEntity), useValue: {} },
        ActivatedGuard,
      ],
    }).compile();

    guard = module.get(ActivatedGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
