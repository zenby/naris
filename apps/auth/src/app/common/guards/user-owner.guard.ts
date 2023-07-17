import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRole } from '@soer/sr-common-interfaces';

@Injectable()
export class UserOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const {
      params: { uuid },
      user: { uuid: userUuid },
    }: { params: { uuid: string }; user: { uuid: string } } = req;

    if (uuid && userUuid && uuid === userUuid) {
      (req?.dynamicRoles as Set<UserRole>)?.add(UserRole.OWNER);
      req.dynamicRoles = req.dynamicRoles ?? new Set<UserRole>([UserRole.OWNER]);
    }
    return true;
  }
}
