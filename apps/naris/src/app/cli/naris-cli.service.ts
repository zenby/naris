import { Injectable } from '@angular/core';

type NarisPatchedWindow = Window & typeof globalThis & { naris: { [key: string]: string | object } };
@Injectable({
  providedIn: 'root',
})
export class NarisCliService {
  add(services: { [key: string]: string | object }): void {
    const wnd = window as NarisPatchedWindow;
    wnd.naris = wnd.naris || {};
    wnd.naris = { ...wnd.naris, ...services };
  }
}
