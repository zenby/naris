import { Component, Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

@Injectable()
export class ConfirmPageLeaveGuard implements CanDeactivate<Component> {
  canDeactivate(): boolean {
    return confirm('Вы точно хотите прекратить редактирование?');
  }
}
