import { BusKey } from '@soer/mixed-bus';

export const DOCUMENT_TAG = 'document';

export interface JsonDocumentKey extends BusKey {
  did: string;
}
