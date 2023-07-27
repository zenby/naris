import { faker } from '@faker-js/faker';
import { ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload.interface';
import { JsonEntity } from '../../modules/json/json.entity';

export const createFakeDocument = (): JsonEntity => {
  return {
    id: faker.datatype.number(),
    json: faker.lorem.text(),
    author_email: faker.internet.email(),
    namespace: faker.lorem.word(),
    accessTag: faker.helpers.arrayElement(['PUBLIC', 'PRIVATE', 'STREAM', 'WORKSHOP', 'PRO']),
  } as JsonEntity;
};

export const createMockExecutionContext = (
  isAuthenticated: boolean,
  jwtPayload: JwtPayload = null,
  document: JsonEntity = null
): ExecutionContext => {
  const request = {
    user: isAuthenticated ? jwtPayload : null,
    params: {
      documentId: document ? document.id : null,
      documentNamespace: document ? document.namespace : null,
    },
  };

  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;
};
