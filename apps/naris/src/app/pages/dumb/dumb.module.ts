import { PreloaderComponent } from '../dumb/preloader/preloader.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayComponent } from './overlay/overlay.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { UnderDevelopmentComponent } from './under-development/under-development.component';
import { SrTextEditComponent } from './sr-text-edit/sr-text-edit.component';
import { RouterModule } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NoContentComponent } from './no-content/no-content.component';

@NgModule({
  declarations: [
    OverlayComponent,
    AccessDeniedComponent,
    UnderDevelopmentComponent,
    SrTextEditComponent,
    NoContentComponent,
    PreloaderComponent,
  ],
  imports: [CommonModule, NzIconModule, NzResultModule, NzButtonModule, RouterModule, NzSpinModule],
  exports: [
    OverlayComponent,
    AccessDeniedComponent,
    UnderDevelopmentComponent,
    SrTextEditComponent,
    PreloaderComponent,
  ],
})
export class DumbModule {}
