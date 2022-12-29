import { EventEmitter } from '@angular/core';

export type FireEvent = Record<string, any>;

export interface MenuItem {
  title: string;
  icon: string;
  link?: string;
  isPro: boolean;
  children?: MenuItem[];
}
export type MenuTree = MenuItem[];

export interface IMenuControl {
  fire: EventEmitter<FireEvent>;
  title: string;
  icon: string;
  cb: () => void;
}
export type ApplicationMenu = [MenuTree | IMenuControl];
