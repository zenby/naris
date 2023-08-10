import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccessDeniedModule, VideoPlayerModule } from '@soer/soer-components';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { VideoViewPageComponent } from './video-view-page/video-view-page.component';
import { LinkTagComponent } from './link-tag/link-tag.component';
import { NzTagModule } from 'ng-zorro-antd/tag';

@NgModule({
  imports: [CommonModule, VideoPlayerModule, NzSpinModule, AccessDeniedModule, NzTagModule],
  declarations: [VideoViewPageComponent, LinkTagComponent],
  exports: [VideoViewPageComponent, LinkTagComponent],
})
export class LinksModule {}
