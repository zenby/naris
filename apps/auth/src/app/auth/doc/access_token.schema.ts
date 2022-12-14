/**
 * This schema describes the format of the GET /access_token response for Swagger.
 */
export const accessTokenSchema = {
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
          token: {
            type: 'string',
            example:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJFbWFpbCI6ImJhckBmb28uY29tIiwiaWF0IjoxNjcxMDQ4MTM5LCJleHAiOjE2NzEwNDkwMzl9.KxmfyXvZ5KLJBP5UeQwpeSA1_ZNYLwo_pZ5VrSRLZ2w',
          },
        },
      },
    },
  },
};
