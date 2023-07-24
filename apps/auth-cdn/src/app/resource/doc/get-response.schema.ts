export const getResourceSchema = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      example: 'ok',
    },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            example: 'folder1',
          },
          children: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  example: 'file1.jpg',
                },
                url: {
                  type: 'string',
                  example: 'host.ru/serveUploadsRoute/folder1!folder2!2023-07-14-6d2oboet~file1.jpg',
                },
              },
            },
          },
        },
      },
    },
  },
};
