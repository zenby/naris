import { Role } from '@soer/soer-components';

export enum NarisNamespaceLabel {
  'GUEST' = 'GUEST',
  'STREAM' = 'STREAM',
  'WORKSHOP' = 'WORKSHOP',
  'PRO' = 'PRO',
}

export interface NarisNamespace {
  namespace: NarisNamespaceLabel;
  expired: Date;
  deadlineMs: number;
}

export interface ProfileDto {
  email: string;
  expired: string;
  firstName: string | null;
  lastName: string | null;
  namespaces: NarisNamespace[];
  role: Role;
}
