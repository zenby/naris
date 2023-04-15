import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { EditAbstractePageComponent } from '../pages/modules/abstracte/edit-abstracte-page/edit-abstracte-page.component';

@Injectable()
export class ConfirmPageLeaveGuard implements CanDeactivate<EditAbstractePageComponent> {
  canDeactivate(component: EditAbstractePageComponent): boolean {
    if (component.canDeactivate()) {
      return true;
    }

    return confirm('Вы точно хотите прекратить редактирование?');
  }
}
