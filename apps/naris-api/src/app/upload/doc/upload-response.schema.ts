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
        type: 'string',
        example: '/1670443088998-795980499.png',
      },
    },
  },
};
