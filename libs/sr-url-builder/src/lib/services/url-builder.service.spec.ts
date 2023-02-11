import { TestBed } from '@angular/core/testing';

import { UrlBuilderService } from './url-builder.service';

describe('UrlBuilderService', () => {
  let service: UrlBuilderService;

  const API_ROOT = 'https://something.ru/api/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: 'UrlBuilderServiceConfig',
          useValue: {
            apiRoot: API_ROOT,
          },
        },
      ],
    });

    service = TestBed.inject(UrlBuilderService);
  });

  describe('build()', () => {
    it('should return string with apiRoot value when method was called without arguments', () => {
      const buildedUrl = service.build();

      expect(buildedUrl).toBe(`${API_ROOT}`);
    });

    it('should return string with apiRoot + apiSuffix when method was called with only apiSuffix argument', () => {
      const buildedUrl = service.build('v2/json/activity');

      expect(buildedUrl).toBe(`${API_ROOT}v2/json/activity`);
    });

    it('should not add part with ":" from apiSuffix to result string when method was called with only apiSuffix argument and it have part with ":"', () => {
      const buildedUrl = service.build('v2/json/activity/:aid');

      expect(buildedUrl).toBe(`${API_ROOT}v2/json/activity`);
    });

    it('should not add part with ":" from apiSuffix to result string', () => {
      const buildedUrl = service.build('v2/json/activity/:aid', { aid: '?' });

      expect(buildedUrl).toBe(`${API_ROOT}v2/json/activity`);
    });

    it('should replace part with ":" from apiSuffix argument with value from key argument', () => {
      const buildedUrl = service.build('v2/json/activity/:aid', { aid: 'personal' });

      expect(buildedUrl).toBe(`${API_ROOT}v2/json/activity/personal`);
    });

    it('should replace part with ":" from apiSuffix argument with value from routeParams argument', () => {
      const buildedUrl = service.build('v2/json/activity/:aid', { aid: '?' }, { aid: 'personal' });

      expect(buildedUrl).toBe(`${API_ROOT}v2/json/activity/personal`);
    });

    it('should transform value from urlParams argument to query string', () => {
      const buildedUrl = service.build('v2/json/activity', {}, {}, { limit: '20', offset: '60' });

      expect(buildedUrl).toBe(`${API_ROOT}v2/json/activity?limit=20&offset=60`);
    });

    it('should transform value from key argument if the same params exist in urlParams argument with values "?"', () => {
      const buildedUrl = service.build(
        'v2/json/activity',
        { sortOrder: 'asc', sortField: 'name' },
        {},
        { sortOrder: '?', sortField: '?' }
      );

      expect(buildedUrl).toBe(`${API_ROOT}v2/json/activity?sortOrder=asc&sortField=name`);
    });

    it('should not transform value from urlParams argument with value "?" if key argument is empty', () => {
      const buildedUrl = service.build('v2/json/activity', {}, {}, { sortOrder: '?' });

      expect(buildedUrl).toBe(`${API_ROOT}v2/json/activity`);
    });
  });
});
