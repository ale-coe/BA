import { EUserRoles } from './user-roles.enum';

export interface IPutUserProfileAttributes {
  username: string;
  city: string;
  userRole: EUserRoles;
  disabled: number;
  userId: number;
}
