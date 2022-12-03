import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { VideoPlayerService } from './video-player.service';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { KinescopePlayerComponent } from './kinescope-player/kinescope-player.component';
import { VimeoPlayerComponent } from './vimeo-player.component';
import { YoutubePlayerComponent } from './youtube-player.component';

@NgModule({
  declarations: [VideoPlayerComponent, KinescopePlayerComponent, YoutubePlayerComponent, VimeoPlayerComponent],
  imports: [YouTubePlayerModule, NzSpinModule, CommonModule],
  providers: [VideoPlayerService],
  exports: [VideoPlayerComponent],
})
export class VideoPlayerModule {}
