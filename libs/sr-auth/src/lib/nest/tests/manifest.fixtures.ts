import { UserManifest } from '../manifest.interface';

export const ManifestWorkshopFixture: UserManifest = {
  email: 'email@gmail.com',
  firstName: 'name',
  lastName: 'lastname',
  role: 'WORKSHOP',
  expired: new Date('2023-08-07T09:29:53.000Z'),
  namespaces: [
    {
      namespace: 'STREAM',
      expired: new Date('2023-08-07T09:29:53.000Z'),
      deadlineMs: 1691400593000,
    },
    {
      namespace: 'WORKSHOP',
      expired: new Date('2023-08-07T09:29:53.000Z'),
      deadlineMs: 1691400593000,
    },
  ],
};
