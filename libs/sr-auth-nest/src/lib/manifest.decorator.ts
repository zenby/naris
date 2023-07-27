import { createParamDecorator } from '@nestjs/common';

export const GetUserManifest = createParamDecorator((_data, context) => {
  const req = context.switchToHttp().getRequest();
  return req.manifest;
});
