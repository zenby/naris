import { Test } from '@nestjs/testing';
import { ManifestService } from './manifest.service';
import { ManifestModule } from './manifest.module';
import { ManifestWorkshopFixture } from './tests/manifest.fixtures';
import { HttpService } from '@nestjs/axios';

const config = {
  apiUrl: 'https://stage.s0er.ru/api/user/manifest',
};

describe('Manifest service', () => {
  let manifestService: ManifestService;
  let httpService: HttpService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ManifestModule.forRoot(config)],
    }).compile();
    manifestService = moduleRef.get<ManifestService>(ManifestService);
    httpService = moduleRef.get<HttpService>(HttpService);
  });

  describe('Resolve manifest', () => {
    it('should use manifest options when request', async () => {
      const getSpy = jest.spyOn(httpService, 'get');
      const manifest = await manifestService.resolve();

      /*      mockReturnValueOnce({
        data: {
          status: 'ok',
          items: [ManifestWorkshopFixture]
        }
      });*/
      // expect(manifest).toEqual(ManifestWorkshopFixture);
      expect(getSpy).toHaveBeenCalledWith(config.apiUrl);
      expect(getSpy).toHaveBeenCalledTimes(1);
    });
  });
});
