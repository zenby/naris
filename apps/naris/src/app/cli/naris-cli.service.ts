import { Injectable } from '@angular/core';

type NarisCliServices = { [key: string]: unknown } & { help?: () => void };

type NarisPatchedWindow = Window & typeof globalThis & { naris: NarisCliServices };

@Injectable({
  providedIn: 'root',
})
export class NarisCliService {
  constructor() {
    this.add({
      help: this.help,
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
}
