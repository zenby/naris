import { ExecutionContext, CanActivate, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@soer/sr-common-interfaces';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<UserRole[]>('roles', [context.getHandler(), context.getClass()]);
    if (!roles) return true;

    const req = context.switchToHttp().getRequest();

    const { user, dynamicRoles } = req;
    if (user?.role === undefined) return false;

    const userRoles = !dynamicRoles
      ? new Set<UserRole>([user.role])
      : new Set<UserRole>([...dynamicRoles, ...[user.role]]);

    return matchRoles(roles, userRoles);
  }
}
function matchRoles(roles: UserRole[], userRoles: Set<UserRole>): boolean {
  return Array.from(userRoles).some((role) => roles.includes(role));
}
