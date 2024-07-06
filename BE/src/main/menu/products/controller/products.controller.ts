import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../../../../auth/guard/admin.guard';
import { ProductsService } from '../services/products.service';
import { PostProductDto } from '../dto/post-product.dto';
import { UserRole } from '../../../../auth/decorators/user-role.decorator';
import { EUserRoles } from '@shared/user-roles.enum';
import { GetProductQueryDto } from '../dto/get-product-query.dto';
import { PutProductDto } from '../dto/put-product.dto';
import { PostBuyProductDto } from '../dto/post-buy-product.dto';
import { UserId } from '../../../../auth/decorators/user-id.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  getProducts(
    @UserRole() userRole: EUserRoles,
    @Query() query: GetProductQueryDto,
  ) {
    return this.productService.getProducts(query, userRole);
  }

  @UseGuards(AdminGuard)
  @Put()
  async updateProduct(@Body() product: PutProductDto) {
    await this.productService.updateProduct(product);
  }

  @UseGuards(AdminGuard)
  @Post()
  async addProduct(@Body() product: PostProductDto) {
    await this.productService.addProduct(product);
  }

  @Post('buy')
  buyProduct(@UserId() userId: number, @Body() body: PostBuyProductDto) {
    return this.productService.buyProduct(userId, body);
  }
}
