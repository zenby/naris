import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ManifestService } from './manifest.service';
import { Reflector } from '@nestjs/core';
import { DynamicRole } from '@soer/sr-common-interfaces';

@Injectable()
export class UserManifestGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly manifest: ManifestService) {}
  private logger = new Logger(UserManifestGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.headers['authorization'].split(' ').pop();
    const manifest = await this.manifest.resolve(token);
    if (!manifest.email) {
      this.logger.error('Manifest does not contain email', manifest);
      return false;
    }

    req.manifest = manifest;
    if (manifest.namespaces.length > 0) {
      const requestedNamespaces = this.reflector.getAllAndOverride<string[]>('namespaces', [
        context.getHandler(),
        context.getClass(),
      ]);
      if (requestedNamespaces && manifest.namespaces.some((_ns) => requestedNamespaces.includes(_ns.namespace))) {
        (req?.dynamicRoles as Set<DynamicRole>)?.add(DynamicRole.VIEWER);
        req.dynamicRoles = req.dynamicRoles ?? new Set<DynamicRole>([DynamicRole.VIEWER]);
      }
    }

    return true;
  }
}
