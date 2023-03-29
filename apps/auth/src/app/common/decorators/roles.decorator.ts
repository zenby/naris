import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@soer/sr-common-interfaces';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
