import { ManifestNamespace } from '@soer/sr-common-interfaces';
import { UserManifest } from '../manifest.interface';

export const ManifestWorkshopFixture: UserManifest = {
  email: 'email@gmail.com',
  firstName: 'name',
  lastName: 'lastname',
  role: 'WORKSHOP',
  expired: new Date('2023-08-07T09:29:53.000Z'),
  namespaces: [
    {
      namespace: ManifestNamespace.WORKSHOP,
      expired: new Date('2023-08-07T09:29:53.000Z'),
      deadlineMs: 1691400593000,
    },
  ],
};

export const ManifestStreamFixture: UserManifest = {
  email: 'email@gmail.com',
  firstName: 'name',
  lastName: 'lastname',
  role: 'STREAM',
  expired: new Date('2023-08-07T09:29:53.000Z'),
  namespaces: [
    {
      namespace: ManifestNamespace.STREAM,
      expired: new Date('2023-08-07T09:29:53.000Z'),
      deadlineMs: 1691400593000,
    },
  ],
};

export const ManifestProFixture: UserManifest = {
  email: 'email@gmail.com',
  firstName: 'name',
  lastName: 'lastname',
  role: 'PRO',
  expired: new Date('2023-08-07T09:29:53.000Z'),
  namespaces: [
    {
      namespace: ManifestNamespace.PRO,
      expired: new Date('2023-08-07T09:29:53.000Z'),
      deadlineMs: 1691400593000,
    },
  ],
};

export const ManifestGuestFixture: UserManifest = {
  email: 'email@gmail.com',
  firstName: 'name',
  lastName: 'lastname',
  role: 'GUEST',
  expired: new Date('2023-08-07T09:29:53.000Z'),
  namespaces: [],
};

export const ManifestUnknownFixture: UserManifest = {
  email: 'email@gmail.com',
  firstName: 'name',
  lastName: 'lastname',
  role: 'UNKNOWN',
  expired: new Date('2023-08-07T09:29:53.000Z'),
  namespaces: [],
};
