import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { VideoPlayerService } from './video-player.service';
import { VideoPlayerComponent } from './video-player/video-player.component';

@NgModule({
  declarations: [VideoPlayerComponent],
  imports: [YouTubePlayerModule, NzSpinModule, CommonModule],
  providers: [VideoPlayerService],
  exports: [VideoPlayerComponent],
})
export class VideoPlayerModule {}
