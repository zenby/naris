export enum Role {
  GUEST = 'GUEST',
  PRO = 'PRO',
  STREAM = 'STREAM',
  WORKSHOP = 'WORKSHOP',
}

export interface ProfileModel {
  email: string;
  fullname: string;
  role: Role;
}
