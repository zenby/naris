import { Injectable } from '@nestjs/common';
import { UserManifest } from './manifest.interface';
import { ManifestWorkshopFixture } from './tests/manifest.fixtures';

@Injectable()
export class ManifestService {
  resolve(): Promise<UserManifest> {
    return Promise.resolve(ManifestWorkshopFixture);
  }
}
