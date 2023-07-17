import { ExecutionContext, CanActivate, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DynamicRole, UserRole } from '@soer/sr-common-interfaces';

@Injectable()
export class RolesAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requestedRoles = this.reflector.getAllAndOverride<(UserRole | DynamicRole)[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!Array.isArray(requestedRoles)) return false;

    const req = context.switchToHttp().getRequest();

    const { user, dynamicRoles } = req;

    const roles = extractRolesFromUser(user?.role);
    const userRoles = !dynamicRoles ? new Set<UserRole>(roles) : new Set<UserRole>([...dynamicRoles, ...roles]);

    return matchRoles(requestedRoles, userRoles);
  }
}

function extractRolesFromUser(roles: undefined): UserRole[];
function extractRolesFromUser(roles: UserRole[]): UserRole[];
function extractRolesFromUser(roles: UserRole): UserRole[];
function extractRolesFromUser(roles: UserRole | UserRole[] | undefined): UserRole[] {
  return Array.isArray(roles) ? roles : roles !== undefined ? [roles] : [];
}

function matchRoles(roles: (UserRole | DynamicRole)[], userRoles: Set<UserRole | DynamicRole>): boolean {
  return Array.from(userRoles).some((role) => roles.includes(role));
}
