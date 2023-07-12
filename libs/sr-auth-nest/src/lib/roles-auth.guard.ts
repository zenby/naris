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
    const roles = Array.isArray(user?.role) ? user.role : [user?.role];

    const userRoles = !dynamicRoles ? new Set<UserRole>(roles) : new Set<UserRole>([...dynamicRoles, ...roles]);

    return matchRoles(requestedRoles, userRoles);
  }
}
function matchRoles(roles: UserRole[], userRoles: Set<UserRole>): boolean {
  return Array.from(userRoles).some((role) => roles.includes(role));
}
