export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  GUEST = 'guest',
  OWNER = 'owner',
}

export interface Role {
  role: UserRole;
}
