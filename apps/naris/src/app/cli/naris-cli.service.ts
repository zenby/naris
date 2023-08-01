import { Injectable } from '@angular/core';
import { BusEmitter } from '@soer/mixed-bus';
import { CommandCreate, CommandPatch } from '@soer/sr-dto';

type NarisCliServices = { [key: string]: unknown } & { help?: () => void };

type NarisPatchedWindow = Window & typeof globalThis & { naris: NarisCliServices };

@Injectable({
  providedIn: 'root',
})
export class NarisCliService {
  constructor() {
    this.add({
      help: this.help,
      commands: this.commands,
    });
  }

  add(services: NarisCliServices): void {
    const wnd = window as NarisPatchedWindow;
    wnd.naris = wnd.naris || {};
    wnd.naris = { ...wnd.naris, ...services };
  }

  help() {
    console.log(`
      localStorage.setItem('featureFlags', JSON.stringify({ 
        featureName: true
      }));
    `);
  }

  commands(): object {
    return {
      create: (ownerId: BusEmitter, options: object): object => new CommandCreate(ownerId, options),
      patch: (ownerId: BusEmitter, options: object): object => new CommandPatch(ownerId, options),
    };
  }
}
