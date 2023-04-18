import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoSource } from '@soer/soer-components';
import { Subscription } from 'rxjs';
import { VideoModel } from '../../../api/streams/stream.model';

@Component({
  selector: 'soer-streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.scss'],
})
export class StreamsComponent implements OnInit, OnDestroy {
  public streams: VideoModel[] = [];
  public isFolderOpen = -1;
  private queryParamsSub: Subscription | null = null;
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.queryParamsSub = this.route.queryParams.subscribe((params) => {
      this.isFolderOpen = params['fid'] || -1;
      if (params['fid'] >= 0) {
        this.streams = this.route.snapshot.data?.['streams'][params['fid']].children || [];
      } else {
        this.streams = this.route.snapshot.data?.['streams'] || [];
      }
    });
  }

  ngOnDestroy(): void {
    if (this.queryParamsSub) {
      this.queryParamsSub.unsubscribe();
    }
  }

  onFolderUp(): void {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: {} });
  }

  showVideoOrOpenFolder(videoOrFolder: VideoModel, index: number): void {
    if (videoOrFolder.children && index >= 0) {
      this.router.navigate(['.'], { relativeTo: this.route, queryParams: { fid: index } });
    } else {
      this.showVideo(videoOrFolder);
    }
  }
  showVideo(video: VideoModel): void {
    const { id: videoId, source: videoSource } = this.getVideoIdAndSource(video);

    if (videoId === undefined) {
      const queryParams = this.route.snapshot.queryParams;
      this.router.navigate(['novideo'], { relativeTo: this.route, queryParams });
      return;
    }
    this.router.navigate([videoSource, videoId], { relativeTo: this.route });
  }

  private getVideoIdAndSource(video: VideoModel): { id?: string; source: VideoSource } {
    if (video.vimeo_id) {
      return { id: video.vimeo_id, source: 'vimeo' };
    }

    if (video.kinescope_id) {
      return { id: video.kinescope_id, source: 'kinescope' };
    }
    return { id: video.youtube_id, source: 'youtube' };
  }
}
