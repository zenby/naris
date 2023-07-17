import { SetMetadata } from '@nestjs/common';
import { DynamicRole, UserRole } from '@soer/sr-common-interfaces';

export const Roles = (...roles: (UserRole | DynamicRole)[]) => SetMetadata('roles', roles);
