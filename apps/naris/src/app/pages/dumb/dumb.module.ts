import { PreloaderComponent } from '../dumb/preloader/preloader.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterModule } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AccessDeniedModule, OverlayModule, NoContentModule } from '@soer/soer-components';

@NgModule({
  declarations: [PreloaderComponent],
  imports: [
    AccessDeniedModule,
    CommonModule,
    NoContentModule,
    NzButtonModule,
    NzIconModule,
    NzResultModule,
    NzSpinModule,
    OverlayModule,
    RouterModule,
  ],
  exports: [PreloaderComponent],
})
export class DumbModule {}
