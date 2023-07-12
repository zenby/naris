import { ConfigService } from '@nestjs/config';
import { ResourceService } from './resource.service';

describe('Resource service', () => {
  let resourceService: ResourceService;

  beforeAll(() => {
    const configService = new ConfigService();
    resourceService = new ResourceService(configService);
  });

  it('cook resources', async () => {
    const files: string[] = [
      '1688027155114-789027491.jpg',
      '1688027732208-157020387.jpg',
      'folder2^folder3^1688463096638-890161750.jpg',
      'folder^1688028439426-483750222.jpg',
      'folder^1688463096638-890161750.jpg',
      'folder^1688464190366-643835433.jpg',
      'folder^folder2^1688463096638-890161750.jpg',
      'folder^folder2^dd1688463096638-890161750.jpg',
      'folder^folder2^folder3^dd1688463096638-890161750.jpg',
      'folder^folder3^1688463096638-890161750.jpg',
    ];

    const expectedResources = [
      {
        title: '1688027155114-789027491.jpg',
      },
      {
        title: '1688027732208-157020387.jpg',
      },
      {
        title: 'folder2',
        children: [
          {
            title: 'folder3',
            children: [
              {
                title: '1688463096638-890161750.jpg',
              },
            ],
          },
        ],
      },
      {
        title: 'folder',
        children: [
          {
            title: '1688028439426-483750222.jpg',
          },
          {
            title: '1688463096638-890161750.jpg',
          },
          {
            title: '1688464190366-643835433.jpg',
          },
          {
            title: 'folder2',
            children: [
              {
                title: '1688463096638-890161750.jpg',
              },
              {
                title: 'dd1688463096638-890161750.jpg',
              },
              {
                title: 'folder3',
                children: [
                  {
                    title: 'dd1688463096638-890161750.jpg',
                  },
                ],
              },
            ],
          },
          {
            title: 'folder3',
            children: [
              {
                title: '1688463096638-890161750.jpg',
              },
            ],
          },
        ],
      },
    ];
    const resources = resourceService.cookResources(files);
    expect(resources).toMatchObject(expectedResources);
  });
});
