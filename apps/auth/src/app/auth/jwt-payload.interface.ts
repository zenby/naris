import { UserRole } from '../user/user.entity';

export interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
}
