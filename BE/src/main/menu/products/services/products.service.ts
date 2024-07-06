import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../../../database/entities/product.entity';
import { Repository } from 'typeorm';
import { PostProductDto } from '../dto/post-product.dto';
import { plainToInstance } from 'class-transformer';
import { EUserRoles } from '@shared/user-roles.enum';
import { GetProductQueryDto } from '../dto/get-product-query.dto';
import { PutProductDto } from '../dto/put-product.dto';
import { BoughtProductEntity } from '../../../../database/entities/bought-product.entity';
import { PostBuyProductDto } from '../dto/post-buy-product.dto';
import { PointsService } from '../../../../util/services/points/points.service';
import { EmailService } from '../../../../util/services/email/email.service';
import { UserEntity } from '../../../../database/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsService {
  private logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(BoughtProductEntity)
    private readonly boughtProductRepo: Repository<BoughtProductEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly pointsService: PointsService,
    private readonly emailService: EmailService,
  ) {}

  getProducts(query: GetProductQueryDto, userRole: EUserRoles) {
    if (query.includeHidden && userRole !== EUserRoles.ADMIN) {
      throw new BadRequestException();
    }

    return this.productRepo.findAndCount({
      select: {
        productId: true,
        imagePath: true,
        name: true,
        hidden: true,
        price: true,
      },
      skip: query.skip,
      take: query.take,
      order: { productId: 'DESC' },
      ...(query.includeHidden ? {} : { where: { hidden: 0 } }),
    });
  }

  async updateProduct(body: PutProductDto) {
    const productEntity = plainToInstance(ProductEntity, body);
    await this.productRepo.save(productEntity);
  }

  async addProduct(product: PostProductDto) {
    const productEntity = plainToInstance(ProductEntity, product);
    productEntity.hidden = 0;
    await this.productRepo.save(productEntity);
  }

  async buyProduct(userId: number, body: PostBuyProductDto) {
    const user = await this.userRepo.findOne({ where: { userId } });
    const product = await this.productRepo.findOne({
      where: { productId: body.productId },
    });

    if (!user || !product) {
      throw new BadRequestException();
    }

    const currentBalance = await this.pointsService.getCurrentBalance(userId);

    const boughtProduct = plainToInstance(BoughtProductEntity, body);
    boughtProduct.userId = userId;

    if (currentBalance < product.price) {
      throw new BadRequestException();
    }

    await this.boughtProductRepo.save(boughtProduct);

    try {
      await this.sendProductBoughtMail(user, product);
    } catch (error) {
      this.logger.error(`Product bought mail not send for ${user.email}`);
    }

    return currentBalance - product.price;
  }

  async sendProductBoughtMail(user: UserEntity, product: ProductEntity) {
    const activationCode = uuidv4();
    const subject = `Kauf von ${product.name}`;
    const html = `<h1>Du hast Punkte umgetauscht!</h1><p>Du hat ${product.name} für ${product.price} Punkte gekauft. Dein Gutscheincode lautet ${activationCode}.</p><p>Dein Cash4Trash-Team</p>`;
    await this.emailService.sendMail(user.email, subject, html);
  }
}
