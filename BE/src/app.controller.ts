import { Controller, Get } from '@nestjs/common';
import { BypassTokenGuard } from './auth/decorators/bypass-token-guard.decorator';
import { BypassActivatedGuard } from './auth/decorators/bypass-activated-guard.decorator';

@Controller()
export class AppController {
  @BypassActivatedGuard()
  @BypassTokenGuard()
  @Get('health')
  getHealth() {
    return true;
  }
}
