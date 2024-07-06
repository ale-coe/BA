import { Body, Controller, Get, Put } from '@nestjs/common';
import { UserId } from '../../../../auth/decorators/user-id.decorator';
import { PutPositionDto } from '../dto/put-position.dto';
import { HomeService } from '../services/home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('shared-positions')
  getSharedPositions(@UserId() userId: number) {
    return this.homeService.getSharedPositions(userId);
  }

  @Get('position-shared')
  getPositionShared(@UserId() userId: number) {
    return this.homeService.getPositionShared(userId);
  }

  @Put('position')
  async updatePosition(@UserId() userId: number, @Body() body: PutPositionDto) {
    await this.homeService.updatePosition(userId, body);
  }
}
