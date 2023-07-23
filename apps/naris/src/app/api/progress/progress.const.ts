import { BusKey } from '@soer/mixed-bus';

export interface ActivityKey extends BusKey {
  aid: string;
}

export interface ActivityV2Key extends BusKey {
  aid: string;
}
