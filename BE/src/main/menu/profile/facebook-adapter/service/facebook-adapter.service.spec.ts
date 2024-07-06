import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { FacebookAdapterService } from './facebook-adapter.service';

describe('FacebookAdapterService', () => {
  let service: FacebookAdapterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacebookAdapterService,
        { provide: HttpService, useValue: {} },
      ],
    }).compile();

    service = module.get<FacebookAdapterService>(FacebookAdapterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
