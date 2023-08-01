export const uploadResponseSchema = {
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
          uri: {
            type: 'string',
            example: 'host.ru/serveUploadsRoute/folder1!folder2!2023-07-14-6d2oboet~file1.jpg',
          },
        },
      },
    },
  },
};
