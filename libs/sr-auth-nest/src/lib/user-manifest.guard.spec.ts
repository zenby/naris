import { UserManifestGuard } from './user-manifest.guard';
import { EMPTY_USER_MANIFEST, ManifestService } from './manifest.service';
import { ManifestWorkshopFixture } from './tests/manifest.fixtures';
import { Reflector } from '@nestjs/core';
import { HttpService } from '@nestjs/axios';
import { DynamicRole, ManifestNamespace } from '@soer/sr-common-interfaces';
import { createMockExecutionContext } from './tests/test-helpers';

describe('UserManifestGuard', () => {
  let userManifestGuard: UserManifestGuard;
  let manifestService: ManifestService;
  let reflector: Reflector;

  beforeEach(async () => {
    reflector = new Reflector();
    manifestService = new ManifestService(new HttpService(), { apiUrl: '' });
    userManifestGuard = new UserManifestGuard(reflector, manifestService);
  });

  it('should return false when user email is empty ', async () => {
    const context = createMockExecutionContext();
    jest.spyOn(manifestService, 'resolve').mockResolvedValue(EMPTY_USER_MANIFEST);

    const result = await userManifestGuard.canActivate(context);

    expect(result).toBe(false);
  });

  it('should return Viewer role when manifest contain one of expected viewerNamespaces', async () => {
    const context = createMockExecutionContext();
    const viewerNamespaces = [ManifestNamespace.PRO, ManifestNamespace.STREAM, ManifestNamespace.WORKSHOP];
    const expectedDynamicRoles = new Set([DynamicRole.VIEWER]);

    reflector.getAllAndOverride = jest.fn().mockReturnValue(viewerNamespaces);
    jest.spyOn(manifestService, 'resolve').mockResolvedValue(ManifestWorkshopFixture);

    await userManifestGuard.canActivate(context);
    expect(context.switchToHttp().getRequest().dynamicRoles).toEqual(expectedDynamicRoles);
  });

  it('should return undefined  when manifest does not contain viewerNamespaces', async () => {
    const context = createMockExecutionContext();
    const viewerNamespaces = [ManifestNamespace.PRO, ManifestNamespace.STREAM];

    reflector.getAllAndOverride = jest.fn().mockReturnValue(viewerNamespaces);
    jest.spyOn(manifestService, 'resolve').mockResolvedValue(ManifestWorkshopFixture);

    await userManifestGuard.canActivate(context);
    expect(context.switchToHttp().getRequest().dynamicRoles).toEqual(undefined);
  });
});
