import { BusMessage } from '@soer/mixed-bus';
import { DtoPack, OK } from '@soer/sr-dto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JsonDTOModel } from './jsonDto.model';

export function parseJsonDTOPack<T>(messages$: Observable<BusMessage>, _id: string): Observable<DtoPack<T>> {
  return messages$.pipe(
    map((data: BusMessage | null) => {
      const result: T[] = [];
      if (data?.payload?.status === OK) {
        data?.payload.items.forEach((item: JsonDTOModel) => result.push({ ...JSON.parse(item.json), id: item.id }));
      }

      return { status: data?.payload?.status ?? OK, items: result };
    })
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataType = Record<string, any>;

export function convertToJsonDTO(data: DataType, excludeKeys: string[] = []): JsonDTOModel {
  const result: DataType = {};
  Object.keys(data).forEach((key) => (excludeKeys.includes(key) ? null : (result[key] = data[key])));
  return { json: JSON.stringify(result) };
}
