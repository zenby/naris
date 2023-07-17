import { ExecutionContext } from '@nestjs/common';
import { DynamicRole } from '@soer/sr-common-interfaces';

export const createMockExecutionContext = (
  options: {
    token?: string;
    dynamicRoles?: DynamicRole[];
    user?: object;
  } = { token: '', dynamicRoles: undefined, user: undefined }
): ExecutionContext => {
  const request = {
    headers: {
      authorization: `Bearer ${options.token || ''}`,
    },
    user: options.user,
    dynamicRoles: options.dynamicRoles,
    req: {},
  };

  return {
    getClass: () => ({}),
    getHandler: () => ({}),
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;
};
