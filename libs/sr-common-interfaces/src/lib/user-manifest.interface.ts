import { ManifestNamespace } from './user-role.interface';

export interface UserManifestNamespace {
  namespace: ManifestNamespace;
  expired: Date;
  deadlineMs: number;
}
export interface UserManifest {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  expired: Date;
  namespaces: UserManifestNamespace[];
}
