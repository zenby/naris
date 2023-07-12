import { ExecutionContext } from '@nestjs/common';

export const createMockExecutionContext = (token = ''): ExecutionContext => {
  const request = {
    headers: {
      authorization: `Bearer ${token}`,
    },
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
