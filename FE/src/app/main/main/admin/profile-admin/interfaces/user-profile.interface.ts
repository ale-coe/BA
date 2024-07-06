import { EUserRoles } from '@shared/user-roles.enum';

export interface IUserProfile {
  city: string | null;
  username: string | null;
  userRole: EUserRoles;
  profileImage: string | null;
  disabled: number;
}
