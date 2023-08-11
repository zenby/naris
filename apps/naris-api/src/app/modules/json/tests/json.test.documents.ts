import { createFakeDocument } from '../../../common/tests/helpers/document.test.helper';
import { JwtTestHelper } from '../../../common/tests/helpers/jwt.test.helper';
import { JsonEntity } from '../json.entity';
import { AccessTag } from '../types/json.const';

export const streamDocument = createFakeDocument({ namespace: 'test', accessTag: AccessTag.STREAM });
export const workshopDocument = createFakeDocument({ namespace: 'test', accessTag: AccessTag.WORKSHOP });
export const proDocument = createFakeDocument({ namespace: 'test', accessTag: AccessTag.PRO });
export const publicDocument = createFakeDocument({ namespace: 'test', accessTag: AccessTag.PUBLIC });
export const privateDocument = createFakeDocument({ namespace: 'test', accessTag: AccessTag.PRIVATE });
export const defaultDocument = createFakeDocument({
  namespace: 'test',
  author_email: JwtTestHelper.defaultPayload.email,
  accessTag: AccessTag.PRIVATE,
});

export const testDocuments: JsonEntity[] = [
  defaultDocument,
  privateDocument,
  publicDocument,
  streamDocument,
  workshopDocument,
  proDocument,
];
