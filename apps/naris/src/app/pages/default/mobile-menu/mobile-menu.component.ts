import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzSiderComponent } from 'ng-zorro-antd/layout';
import { UserModel } from '../../../services/application.models';
import { IMenuControl, MenuTree } from '../../../services/menu/menu.interfaces';

@Component({
  selector: 'soer-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss'],
})
export class MobileMenuComponent {
  @Input() isMobile = false;
  @Input() userInfo: UserModel = { id: -1, role: '', email: '' };
  @Input() applicationMenu: MenuTree = [];
  @Input() controls: IMenuControl[] | null = null;
  @Output() logout = new EventEmitter<boolean>();
  @Output() check = new EventEmitter<NzSiderComponent>();

  isMenuOpen = false;
  isOpenControlPanel = false;

  openMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  controlPanel(control: IMenuControl): void {
    this.checkOpenControlPanel(control.title);
    control.cb();
  }

  checkOpenControlPanel(nameControl: string): void {
    if (nameControl.toLowerCase() === 'добавить') {
      this.isOpenControlPanel = true;
    }
    if (nameControl.toLowerCase() === 'назад') {
      this.isOpenControlPanel = false;
    }
  }
}
