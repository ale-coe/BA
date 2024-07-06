import { EUserRoles } from '@shared/user-roles.enum';
import { Request } from 'express';

export interface CustomRequestInterface extends Request {
  userId: number;
  userRole: EUserRoles.ADMIN | EUserRoles.USER;
}
