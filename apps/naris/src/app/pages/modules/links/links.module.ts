import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VideoPlayerModule } from '@soer/soer-components';
import { VideoViewPageComponent } from './video-view-page/video-view-page.component';

@NgModule({
  imports: [CommonModule, VideoPlayerModule],
  declarations: [VideoViewPageComponent],
  exports: [VideoViewPageComponent],
})
export class LinksModule {}
