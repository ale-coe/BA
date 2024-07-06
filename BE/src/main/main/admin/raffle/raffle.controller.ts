import { Controller, Get, UseGuards } from '@nestjs/common';
import { RaffleService } from './controller/raffle.service';
import { AdminGuard } from '../../../../auth/guard/admin.guard';

@Controller('raffle')
export class RaffleController {
  constructor(private readonly raffleService: RaffleService) {}

  @UseGuards(AdminGuard)
  @Get()
  getRaffles() {
    return this.raffleService.getRaffles();
  }
}
