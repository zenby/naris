import { BusKey } from '@soer/mixed-bus';

export const WORKBOOK_TAG = 'workbook';
export const WORKBOOKS_TAG = 'workbooks';

export interface WorkbookKey extends BusKey {
  wid: string;
}
