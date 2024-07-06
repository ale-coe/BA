import { Controller, Get, Query } from '@nestjs/common';
import { UserId } from '../../../auth/decorators/user-id.decorator';
import { PointsService } from '../../../util/services/points/points.service';
import { PaginationDto } from '@shared/dto/pagination.dto';

@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Get('balance')
  getCurrentBalance(@UserId() userId: number) {
    return this.pointsService.getCurrentBalance(userId);
  }

  @Get('current')
  getCurrentMonthsPoints(@UserId() userId: number) {
    return this.pointsService.getCurrentMonthsPoints(userId);
  }

  @Get('ranking')
  getRanking(@Query() pagination: PaginationDto) {
    return this.pointsService.getRanking(pagination);
  }
}
