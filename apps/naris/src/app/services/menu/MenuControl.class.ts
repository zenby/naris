import { EventEmitter } from '@angular/core';
import { FireEvent, IMenuControl } from './menu.interfaces';

export class MenuControl implements IMenuControl {
  public fire: EventEmitter<FireEvent> = new EventEmitter<FireEvent>();
  constructor(public title: string, public icon: string, public cb: () => void) {}
}
