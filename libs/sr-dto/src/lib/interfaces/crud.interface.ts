import { BusMessage } from '@soer/mixed-bus';
import { DtoPack } from './dto.pack.interface';

export interface CRUD {
  create(msg: BusMessage): Promise<DtoPack>;
  read(msg: BusMessage): Promise<DtoPack>;
  update(msg: BusMessage): Promise<DtoPack>;
  delete(msg: BusMessage): Promise<DtoPack>;
}
