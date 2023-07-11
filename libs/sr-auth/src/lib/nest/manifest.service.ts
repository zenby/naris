import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { first, lastValueFrom } from 'rxjs';
import { ManifestModuleOptions, UserManifest } from './manifest.interface';

export const EmptyUserManifest: UserManifest = {
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

  private async resolveUserManifestV1(token: string): Promise<Partial<UserManifest>> {
    try {
      const headersRequest = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      const result = await lastValueFrom(
        this.http.get<{ status: 'ok' | 'error'; items: UserManifest[] }>(this.options.apiUrl, {
          headers: headersRequest,
        })
      );

      if (result.data.status.toLowerCase() === 'ok') {
        const [item] = result.data.items;
        return item || EmptyUserManifest;
      }
    } catch (e) {
      // console.error(e);
      // nothing to do
    }

    return EmptyUserManifest;
  }
  async resolve(token: string): Promise<UserManifest> {
    return {
      ...EmptyUserManifest,
      ...(await this.resolveUserManifestV1(token)),
    };
  }
}
