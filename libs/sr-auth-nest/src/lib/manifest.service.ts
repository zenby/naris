import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ManifestModuleOptions, UserManifest } from './manifest.interface';

export const EMPTY_USER_MANIFEST: UserManifest = {
  email: '',
  firstName: '',
  lastName: '',
  role: '',
  expired: new Date(),
  namespaces: [],
};

@Injectable()
export class ManifestService {
  constructor(private readonly http: HttpService, private options: ManifestModuleOptions) {}
  private logger = new Logger(ManifestService.name);

  private async resolveUserManifestV1(token: string): Promise<Partial<UserManifest>> {
    try {
      const headersRequest = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      this.logger.log('Загрузка манифеста ', this.options.apiUrl);
      const result = await lastValueFrom(
        this.http.get<{ status: 'ok' | 'error'; items: UserManifest[] }>(this.options.apiUrl, {
          headers: headersRequest,
        })
      );

      if (result.data.status.toLowerCase() === 'ok') {
        const [item] = result.data.items;
        return item || EMPTY_USER_MANIFEST;
      }
    } catch (e) {
      this.logger.error(e);
      // nothing to do
    }

    return EMPTY_USER_MANIFEST;
  }
  async resolve(token: string): Promise<UserManifest> {
    return {
      ...EMPTY_USER_MANIFEST,
      ...(await this.resolveUserManifestV1(token)),
    };
  }
}
