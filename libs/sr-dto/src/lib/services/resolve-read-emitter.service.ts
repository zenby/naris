import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BusEmitter, busEmitterFactory, MixedBusService } from '@soer/mixed-bus';
import { of } from 'rxjs';
import { CommandRead } from '../bus-messages/bus.messages';
import { CRUDBusEmitter } from '../sr-dto.module';

type ResolveEmittersPatchedWindow = Window & { naris?: { resolvedEmitters?: Record<string, BusEmitter> } };

export class ResolveReadEmitterService implements Resolve<Promise<BusEmitter | undefined>> {
  constructor(private bus$: MixedBusService, private owner: CRUDBusEmitter) {}

  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<BusEmitter | undefined> {
    const owner = busEmitterFactory(this.owner, route.params);

    this.patchConsole(owner);

    this.bus$.publish(new CommandRead(owner));
    //TODO: refactor toPromise to firstValueOf
    return of(owner).toPromise();
  }

  private patchConsole(owner: BusEmitter) {
    const wnd = window as ResolveEmittersPatchedWindow;

    try {
      wnd.naris = wnd.naris || {};
      wnd.naris.resolvedEmitters = wnd.naris.resolvedEmitters || {};
      wnd.naris.resolvedEmitters[owner.sid.toString()] = owner;
    } catch (e) {
      console.error('Ошибка назначения срезолвенных эмиттеров для консоли');
    }
  }
}
