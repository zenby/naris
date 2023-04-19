import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean;
}

@Injectable()
export class ConfirmPageLeaveGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): boolean {
    if (component.canDeactivate()) {
      return true;
    }

    return confirm('Вы точно хотите прекратить редактирование?');
  }
}
