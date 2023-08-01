export const errorResponseSchema = {
  type: 'object',
  properties: {
    statusCode: { type: 'integer', example: 400 },
    message: { type: 'string', example: 'Error message' },
  },
};
