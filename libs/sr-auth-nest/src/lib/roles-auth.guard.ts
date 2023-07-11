import { ExecutionContext, CanActivate, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@soer/sr-common-interfaces';

@Injectable()
export class RolesAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requestedRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requestedRoles) return false;

    const req = context.switchToHttp().getRequest();

    const { user, dynamicRoles } = req;

    const userRoles = !dynamicRoles
      ? new Set<UserRole>([user?.role])
      : new Set<UserRole>([...dynamicRoles, ...[user?.role]]);

    return matchRoles(requestedRoles, userRoles);
  }
}
function matchRoles(roles: UserRole[], userRoles: Set<UserRole>): boolean {
  return Array.from(userRoles).some((role) => roles.includes(role));
}
