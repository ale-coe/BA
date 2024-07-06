import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { TokenGuard } from './token.guard';

describe('TokenGuard', () => {
  let guard: TokenGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: Reflector, useValue: {} },
        { provide: AuthService, useValue: {} },
        TokenGuard,
      ],
    }).compile();

    guard = module.get(TokenGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
