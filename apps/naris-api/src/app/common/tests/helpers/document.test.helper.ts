import { faker } from '@faker-js/faker';
import { ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../types/jwt-payload.interface';
import { JsonEntity } from '../../../modules/json/json.entity';

type DocumentInfo = Partial<JsonEntity>;
/**
 * createdAt, updatedAt не включаем в фейковый документ, чтобы
 * избежать проблем при конвертации дат в строки в e2e тестах
 */
export const createFakeDocument = (docInfo?: DocumentInfo): JsonEntity => {
  return {
    id: docInfo?.id ?? faker.datatype.number(),
    json: docInfo?.json ?? faker.lorem.text(),
    author_email: docInfo?.author_email ?? faker.internet.email(),
    namespace: docInfo?.namespace ?? faker.lorem.word(),
    accessTag: docInfo?.accessTag ?? faker.helpers.arrayElement(['PUBLIC', 'PRIVATE', 'STREAM', 'WORKSHOP', 'PRO']),
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
