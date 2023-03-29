import { BusMessage } from '@soer/mixed-bus';
import { DtoPack, OK } from '@soer/sr-dto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JsonDTOModel } from './jsonDto.model';

export function parseJsonDTOPack<T>(messages$: Observable<BusMessage>, id: string): Observable<DtoPack<T>> {
  console.log(`Start pipe '${id}' => ok`);
  return messages$.pipe(
    map((data: BusMessage | null) => {
      const result: T[] = [];
      console.log(`Pipe map '${id}' => `, data);
      if (data?.payload?.status === OK) {
        data?.payload.items.forEach((item: JsonDTOModel) => result.push({ ...JSON.parse(item.json), id: item.id }));
      }
      console.log(`after pipe '${id}' =>`, result, data);
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
