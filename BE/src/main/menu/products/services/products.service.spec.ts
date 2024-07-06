import { Test, TestingModule } from '@nestjs/testing';
import { BoughtProductEntity } from '../../../../database/entities/bought-product.entity';
import { ProductEntity } from '../../../../database/entities/product.entity';
import { UserEntity } from '../../../../database/entities/user.entity';
import { EmailService } from '../../../../util/services/email/email.service';
import { PointsService } from '../../../../util/services/points/points.service';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(ProductEntity), useValue: {} },
        { provide: getRepositoryToken(BoughtProductEntity), useValue: {} },
        { provide: getRepositoryToken(UserEntity), useValue: {} },
        { provide: PointsService, useValue: {} },
        { provide: EmailService, useValue: {} },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
