import { ConfigService } from '@nestjs/config';
import { ResourceService } from './resource.service';
import { Resource } from './resource.model';
import { ResourceRepository } from './resource.repository';

describe('Resource service', () => {
  let resourceService: ResourceService;

  beforeAll(() => {
    const configService = new ConfigService({ serveUploadsRoute: 'serveUploadsRoute', host: 'host.ru' });
    const resourceRepository = new ResourceRepository(configService);
    resourceService = new ResourceService(resourceRepository, configService);
  });

  it('cook resources', async () => {
    const files: string[] = [
      'folder1!folder2!2023-07-14-6d2oboet~file1.jpg',
      'folder1!folder2!2023-07-14-9d2otoet~file1.jpg',
      'folder1!folder3!2023-07-14-8d2odoet~file1.jpg',
      'folder3!folder2!2023-07-14-7d2oboet~file2.jpg',
      'folder1!2023-07-14-1d2oboet~file3.jpg',
      '2023-07-14-2d2oboet~file4.jpg',
    ];

    const expectedResources: Resource[] = [
      {
        title: 'folder1',
        children: [
          {
            title: 'folder2',
            children: [
              { title: 'file1.jpg', url: 'host.ru/serveUploadsRoute/folder1!folder2!2023-07-14-6d2oboet~file1.jpg' },
              { title: 'file1.jpg', url: 'host.ru/serveUploadsRoute/folder1!folder2!2023-07-14-9d2otoet~file1.jpg' },
            ],
          },
          {
            title: 'folder3',
            children: [
              { title: 'file1.jpg', url: 'host.ru/serveUploadsRoute/folder1!folder3!2023-07-14-8d2odoet~file1.jpg' },
            ],
          },
          { title: 'file3.jpg', url: 'host.ru/serveUploadsRoute/folder1!2023-07-14-1d2oboet~file3.jpg' },
        ],
      },
      {
        title: 'folder3',
        children: [
          {
            title: 'folder2',
            children: [
              { title: 'file2.jpg', url: 'host.ru/serveUploadsRoute/folder3!folder2!2023-07-14-7d2oboet~file2.jpg' },
            ],
          },
        ],
      },
      { title: 'file4.jpg', url: 'host.ru/serveUploadsRoute/2023-07-14-2d2oboet~file4.jpg' },
    ];
    const resources = resourceService.cookResources(files);

    expect(resources).toStrictEqual(expectedResources);
  });
});
