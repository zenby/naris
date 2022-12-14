/**
 * This schema describes the format of the POST /signin response for Swagger.
 */
export const responseSchema = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      example: 'ok',
    },
  },
};
