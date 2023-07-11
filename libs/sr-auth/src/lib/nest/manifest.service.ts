import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { first, lastValueFrom } from 'rxjs';
import { UserManifest } from './manifest.interface';

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
  constructor(private readonly http: HttpService) {}

  private async resolveUserManifestV1(): Promise<Partial<UserManifest>> {
    try {
      const result = await lastValueFrom(
        this.http.get<{ status: 'ok' | 'error'; items: UserManifest[] }>('https://stage.s0er.ru/api/user/manifest')
      );

      if (result.data.status.toLowerCase() === 'ok') {
        const [item] = result.data.items;
        return item || EmptyUserManifest;
      }
    } catch (e) {
      // nothing to do
    }

    return EmptyUserManifest;
  }
  async resolve(): Promise<UserManifest> {
    console.log({
      ...EmptyUserManifest,
      ...(await this.resolveUserManifestV1()),
    });
    return EmptyUserManifest;
  }
}
