import { Test } from '@nestjs/testing';
import { ManifestService } from './manifest.service';
import { ManifestModule } from './manifest.module';
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
    it('should use manifest options with auth when request', async () => {
      const getSpy = jest.spyOn(httpService, 'get');

      await manifestService.resolve('jwttoken');

      expect(getSpy).toHaveBeenCalledWith(config.apiUrl, {
        headers: { Authorization: 'Bearer jwttoken', 'Content-Type': 'application/json' },
      });
    });
  });
});
