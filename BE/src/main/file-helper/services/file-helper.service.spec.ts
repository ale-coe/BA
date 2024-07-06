import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueueService } from '../../../util/services/queue/queue.service';
import { ImageEntity } from '../../../database/entities/image.entity';
import { UserEntity } from '../../../database/entities/user.entity';
import { FileHelperService } from './file-helper.service';

describe('FileHelperService', () => {
  let service: FileHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileHelperService,
        { provide: getRepositoryToken(UserEntity), useValue: {} },
        { provide: getRepositoryToken(ImageEntity), useValue: {} },
        { provide: QueueService, useValue: {} },
      ],
    }).compile();

    service = module.get<FileHelperService>(FileHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
