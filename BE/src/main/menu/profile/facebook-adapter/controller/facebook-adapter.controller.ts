import { Controller, Get, Query } from '@nestjs/common';
import { FacebookAdapterService } from '../service/facebook-adapter.service';
import { GetCheckTokenQueryDto } from '../dto/get-check-token-query.dto';

@Controller('facebook-adapter')
export class FacebookAdapterController {
  constructor(
    private readonly facebookAdapterService: FacebookAdapterService,
  ) {}

  @Get('check-token')
  checkToken(@Query() query: GetCheckTokenQueryDto) {
    return this.facebookAdapterService.checkToken(query);
  }
}
