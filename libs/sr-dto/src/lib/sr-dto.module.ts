import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { BusEmitter, BusKey, BusKeys, MixedBusService } from '@soer/mixed-bus';
import { DeSerializeJsonPipe, DtoLastItemPipe } from './dto.pipes';
import { DataStoreService } from './services/data-store.service';
import { ResolveReadEmitterService } from './services/resolve-read-emitter.service';
import { StoreCrudService } from './services/store.crud.service';

export type CRUDMethods = { create: string; read: string; update: string; delete: string };
export type UrlSchema = { url: string; params?: Record<string, string> };

type EmittersPatchedWindow = Window & { naris?: { emitters?: Record<string, CRUDBusEmitter> } };

export interface CRUDBusEmitter extends BusEmitter {
  schema: UrlSchema;
}
interface CrudOptions<T extends BusKey> {
  namespace: string;
  schema: UrlSchema;
  keys: BusKeys<T>;
}

@NgModule({
  declarations: [DtoLastItemPipe, DeSerializeJsonPipe],
  imports: [CommonModule],
  providers: [],
  exports: [DtoLastItemPipe, DeSerializeJsonPipe],
})
export class SrDTOModule {
  static forChild<T extends BusKey = BusKey>(options: CrudOptions<T>): ModuleWithProviders<SrDTOModule> {
    return {
      ngModule: SrDTOModule,
      providers: createcrudEmitters<T>(options),
    };
  }

  static forRoot(): ModuleWithProviders<SrDTOModule> {
    return {
      ngModule: SrDTOModule,
      providers: [StoreCrudService, DataStoreService],
    };
  }
}

function createcrudEmitters<T extends BusKey>(options: CrudOptions<T>): Provider[] {
  const result: Provider[] = [];
  const sid = Symbol(options.namespace);

  Object.keys(options.keys).forEach((keyName) => {
    const createCRUDBusEmitterFrom = (schema: UrlSchema, key: BusKey): CRUDBusEmitter => {
      return { sid, schema, key };
    };

    const emitter: CRUDBusEmitter = createCRUDBusEmitterFrom(options.schema, options.keys[keyName]);

    result.push(createDataEmitter(keyName, emitter), createCRUDSBusId(keyName, emitter));
  });
  return result;
}

function createCRUDSBusId(providerName: string, emitter: CRUDBusEmitter): Provider {
  const wnd = window as EmittersPatchedWindow;

  try {
    // для работы из консоли браузера со стором "высовываем" наружу эмиттеры данных
    wnd.naris = wnd.naris || {};
    wnd.naris.emitters = wnd.naris.emitters || {};
    wnd.naris.emitters[providerName] = emitter;
  } catch (e) {
    console.error('Не могу создать эмиттеры для консоли');
  }

  return {
    provide: `${providerName}`,
    useFactory: () => {
      return emitter;
    },
  };
}

function createDataEmitter(providerName: string, emitter: CRUDBusEmitter): Provider {
  return {
    provide: `${providerName}Emitter`,
    useFactory: (bus$: MixedBusService) => {
      return new ResolveReadEmitterService(bus$, emitter);
    },
    deps: [MixedBusService],
  };
}
