import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { CustomRequestInterface } from '../../interfaces/custom-request.interface';
import { AuthService } from '../services/auth.service';
import { BypassTokenGuard } from '../decorators/bypass-token-guard.decorator';

@Injectable()
export class TokenGuard implements CanActivate {
  private logger = new Logger(TokenGuard.name);

  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const bypassTokenGuard = this.reflector.get(
      BypassTokenGuard,
      context.getHandler(),
    );

    if (bypassTokenGuard) {
      return true;
    }

    try {
      const req = context.switchToHttp().getRequest<CustomRequestInterface>();
      const token = this.authService.extractTokenFromHeader(req);
      this.authService.verifyToken(token);
      const { userId, userRole } = this.authService.decodeJwt(token);
      req.userId = userId;
      req.userRole = userRole;
    } catch (_error) {
      this.logger.warn('Invalid token sent');
      return false;
    }

    return true;
  }
}
