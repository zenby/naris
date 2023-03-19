import { ExecutionContext, CanActivate, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../../auth/auth.service';
import { Configuration } from '../../config/config';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    const req = context.switchToHttp().getRequest();
    const cookieName = this.configService.get<Configuration['jwt']>('jwt').cookieName;
    const refreshToken = req.cookies?.[cookieName];

    if (!refreshToken) return false;

    const user = await this.authService.getVerifiedUserByRefreshToken(refreshToken);
    if (user instanceof Error) return false;

    return matchRoles(roles, user.role);
  }
}
function matchRoles(roles: string[], userRole: string): boolean {
  return roles.includes(userRole);
}
