import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MixedBusService } from '@soer/mixed-bus';
import { VideoSource } from '@soer/soer-components';
import { DataStoreService, deSerializeJson, extractDtoPackFromBus, SerializedJsonModel } from '@soer/sr-dto';
import { Observable } from 'rxjs';

interface VideoLink {
  type: string;
  player: VideoSource;
  key: string;
}

@Component({
  selector: 'soer-video-view-page',
  templateUrl: './video-view-page.component.html',
  styleUrls: ['./video-view-page.component.scss'],
})
export class VideoViewPageComponent {
  links$: Observable<VideoLink[]>;

  private linkId;
  constructor(
    private bus$: MixedBusService,
    private store$: DataStoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.linkId = this.route.snapshot.data['link'];
    this.links$ = deSerializeJson<VideoLink>(extractDtoPackFromBus<SerializedJsonModel>(this.store$.of(this.linkId)));
  }
}
