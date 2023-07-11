export interface ManifestNamespace {
  namespace: string;
  expired: Date;
  deadlineMs: number;
}
export interface UserManifest {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  expired: Date;
  namespaces: ManifestNamespace[];
}
