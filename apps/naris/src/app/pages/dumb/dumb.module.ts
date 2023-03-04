import { PreloaderComponent } from '../dumb/preloader/preloader.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterModule } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NoContentComponent } from './no-content/no-content.component';
import { AccessDeniedModule, OverlayModule } from '@soer/soer-components';

@NgModule({
  declarations: [NoContentComponent, PreloaderComponent],
  imports: [
    CommonModule,
    NzIconModule,
    NzResultModule,
    NzButtonModule,
    RouterModule,
    NzSpinModule,
    AccessDeniedModule,
    OverlayModule,
  ],
  exports: [PreloaderComponent],
})
export class DumbModule {}
