import { ApiBodyOptions } from '@nestjs/swagger';

export const uploadImagesBodySchema: ApiBodyOptions = {
  schema: {
    type: 'object',
    properties: {
      files: {
        type: 'array',
        format: 'binary',
        description: 'Image files with mimetype ^image/*',
      },
    },
  },
};
