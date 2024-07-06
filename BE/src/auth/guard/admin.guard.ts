import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { EUserRoles } from '@shared/user-roles.enum';
import { Observable } from 'rxjs';
import { CustomRequestInterface } from '../../interfaces/custom-request.interface';

@Injectable()
export class AdminGuard implements CanActivate {
  private logger = new Logger(AdminGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<CustomRequestInterface>();
    if (req.userRole !== EUserRoles.ADMIN) {
      this.logger.warn(`User with id ${req.userId} is not an admin`);
      return false;
    }

    return true;
  }
}
