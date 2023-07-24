export const uploadBodySchema = {
  schema: {
    type: 'object',
    properties: {
      path: { type: 'string' },
      file: {
        type: 'string',
        format: 'binary',
      },
    },
  },
};
