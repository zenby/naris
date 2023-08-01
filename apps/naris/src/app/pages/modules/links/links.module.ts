import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccessDeniedModule, VideoPlayerModule } from '@soer/soer-components';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { VideoViewPageComponent } from './video-view-page/video-view-page.component';

@NgModule({
  imports: [CommonModule, VideoPlayerModule, NzSpinModule, AccessDeniedModule],
  declarations: [VideoViewPageComponent],
  exports: [VideoViewPageComponent],
})
export class LinksModule {}
