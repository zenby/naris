/**
 * This schema describes the body format for a POST /upload for Swagger
 */
export const uploadBodySchema = {
  type: 'object',
  properties: {
    file: {
      type: 'string',
      format: 'binary',
    },
  },
};
