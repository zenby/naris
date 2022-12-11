import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() check = new EventEmitter<any>();

  classAnimationSCSS = 'display-none';

  onShowMenu(): void {
    switch (this.classAnimationSCSS) {
      case 'display-none':
        this.classAnimationSCSS = 'open-menu-animation';
        break;
      case 'open-menu-animation':
        this.classAnimationSCSS = 'close-menu-animation';
        break;
      case 'close-menu-animation':
        this.classAnimationSCSS = 'open-menu-animation';
        break;
      default:
        this.classAnimationSCSS = 'display-none';
    }
  }

  hideMenu(): void {
    if (this.classAnimationSCSS === 'open-menu-animation'){
      this.classAnimationSCSS = 'close-menu-animation'
    }
  }
}
