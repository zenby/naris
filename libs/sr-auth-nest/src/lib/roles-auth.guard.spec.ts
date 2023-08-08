import { Reflector } from '@nestjs/core';
import { DynamicRole, UserRole } from '@soer/sr-common-interfaces';
import { createMockExecutionContext } from './tests/test-helpers';
import { RolesAuthGuard } from './roles-auth.guard';

describe('RolesAuthGuard should check dynamic and static roles', () => {
  let rolesAuthGuard: RolesAuthGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    reflector = new Reflector();
    rolesAuthGuard = new RolesAuthGuard(reflector);
  });

  it('should return false when requested roles is empty ', async () => {
    const context = createMockExecutionContext();
    const result = await rolesAuthGuard.canActivate(context);

    expect(result).toBe(false);
  });

  it('should return true when user has expected DynamicRole', async () => {
    const userContext = createMockExecutionContext({
      dynamicRoles: [DynamicRole.VIEWER, DynamicRole.OWNER],
    });
    const requestedRoles = [DynamicRole.VIEWER];

    reflector.getAllAndOverride = jest.fn().mockReturnValue(requestedRoles);

    const result = await rolesAuthGuard.canActivate(userContext);
    expect(result).toBe(true);
  });

  it('should return false when user does not have expected DynamicRole', async () => {
    const userContext = createMockExecutionContext({
      dynamicRoles: [DynamicRole.OWNER],
    });
    const requestedRoles = [DynamicRole.VIEWER];

    reflector.getAllAndOverride = jest.fn().mockReturnValue(requestedRoles);

    const result = await rolesAuthGuard.canActivate(userContext);
    expect(result).toBe(false);
  });

  it('should return true when user has expected static role and user has many roles', async () => {
    const userContext = createMockExecutionContext({
      user: {
        role: [UserRole.ADMIN, UserRole.OWNER, UserRole.MODERATOR],
      },
    });
    const requestedRoles = [UserRole.ADMIN];

    reflector.getAllAndOverride = jest.fn().mockReturnValue(requestedRoles);

    const result = await rolesAuthGuard.canActivate(userContext);
    expect(result).toBe(true);
  });

  it('should return true when user has single role (not array)', async () => {
    const userContext = createMockExecutionContext({
      user: {
        role: UserRole.ADMIN,
      },
    });
    const requestedRoles = [UserRole.ADMIN];

    reflector.getAllAndOverride = jest.fn().mockReturnValue(requestedRoles);

    const result = await rolesAuthGuard.canActivate(userContext);
    expect(result).toBe(true);
  });

  it('should return FALSE when user  does not have expected static role', async () => {
    const userContext = createMockExecutionContext({
      user: {
        role: UserRole.USER,
      },
    });
    const requestedRoles = [UserRole.ADMIN];

    reflector.getAllAndOverride = jest.fn().mockReturnValue(requestedRoles);

    const result = await rolesAuthGuard.canActivate(userContext);
    expect(result).toBe(false);
  });
});
