import { faker } from '@faker-js/faker';
import { DELIMETERS } from '../constants';
import { FileData } from '../resource.model';

export function generateTestFileData({
  pathFolders,
  name = faker.lorem.word(),
}: {
  pathFolders?: string[];
  name?: string;
}): FileData {
  const folders =
    pathFolders || Array.from({ length: faker.datatype.number({ min: 2, max: 5 }) }).map(() => faker.lorem.word());

  const filename = name + '.txt';

  return {
    folders,
    path: folders.join(DELIMETERS.PATH),
    filename,
    fileMultipartData: [
      Buffer.from(filename),
      {
        filename,
        contentType: 'text/plain',
      },
    ],
  };
}
