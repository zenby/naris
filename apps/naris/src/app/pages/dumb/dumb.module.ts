import { PreloaderComponent } from '../dumb/preloader/preloader.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayComponent } from './overlay/overlay.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterModule } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NoContentComponent } from './no-content/no-content.component';
import { AccessDeniedModule } from '@soer/soer-components';

@NgModule({
  declarations: [OverlayComponent, NoContentComponent, PreloaderComponent],
  imports: [CommonModule, NzIconModule, NzResultModule, NzButtonModule, RouterModule, NzSpinModule, AccessDeniedModule],
  exports: [OverlayComponent, PreloaderComponent],
})
export class DumbModule {}
