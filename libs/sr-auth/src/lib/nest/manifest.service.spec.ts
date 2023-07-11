import { Test } from '@nestjs/testing';
import { ManifestService } from './manifest.service';
import { ManifestModule } from './manifest.module';
import { ManifestWorkshopFixture } from './tests/manifest.fixtures';

describe('Manifest service', () => {
  let manifestService: ManifestService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ManifestModule],
    }).compile();
    manifestService = moduleRef.get<ManifestService>(ManifestService);
  });

  describe('Resolve manifest', () => {
    it('should resolve manifest', async () => {
      const manifest = await manifestService.resolve();
      expect(manifest).toEqual(ManifestWorkshopFixture);
    });
  });
});
