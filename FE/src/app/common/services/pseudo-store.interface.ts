import { TCoords } from '@shared/coords.type';
import { EUserRoles } from '@shared/user-roles.enum';

export interface IPseudoStore {
  title: string;
  positionShared: boolean;
  coords: TCoords | undefined;
  userRole: EUserRoles.ADMIN | EUserRoles.USER | undefined;
  userId: number | undefined;
  online: boolean;
  activeMainscreen: 'home' | 'ladder' | 'feed' | 'admin' | false;
}
