export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  GUEST = 'guest',
  OWNER = 'owner',
}

export enum DynamicRole {
  OWNER = 'owner',
  VIEWER = 'viewer',
}

export enum ManifestNamespace {
  'WORKSHOP' = 'WORKSHOP',
  'STREAM' = 'STREAM',
  'PRO' = 'PRO',
}

export interface Role {
  role: UserRole;
}
