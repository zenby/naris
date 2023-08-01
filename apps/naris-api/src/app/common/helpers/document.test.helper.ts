import { faker } from '@faker-js/faker';
import { ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../types/jwt-payload.interface';
import { JsonEntity } from '../../modules/json/json.entity';

/**
 * createdAt, updatedAt не включаем в фейковый документ, чтобы
 * избежать проблем при конвертации дат в строки в e2e тестах
 */
export const createFakeDocument = (): JsonEntity => {
  return {
    id: faker.datatype.number(),
    json: faker.lorem.text(),
    namespace: faker.lorem.word(),
    author_email: faker.internet.email(),
    accessTag: faker.helpers.arrayElement(['PUBLIC', 'PRIVATE', 'STREAM', 'WORKSHOP', 'PRO']),
  } as JsonEntity;
};

export const jsonEntityMetadataPropertiesMap = {
  propertiesMap: {
    id: 'id',
    json: 'json',
    namespace: 'namespace',
    author_email: 'author_email',
    accessTag: 'accessTag',
  },
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
