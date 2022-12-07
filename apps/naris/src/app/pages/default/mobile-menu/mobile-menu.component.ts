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

  classAnimationSCSS = 'displayNone';

  onShowMenu(): void {
    switch (this.classAnimationSCSS) {
      case 'displayNone':
        this.classAnimationSCSS = 'isShowMenu';
        break;
      case 'isShowMenu':
        this.classAnimationSCSS = 'isHideMenu';
        break;
      case 'isHideMenu':
        this.classAnimationSCSS = 'isShowMenu';
        break;
      default:
        this.classAnimationSCSS = 'displayNone';
    }
  }

  onHideMenu(): void {
    if (this.classAnimationSCSS === 'isShowMenu'){
      this.classAnimationSCSS = 'isHideMenu'
    }
  }
}
