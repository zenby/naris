import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoSource } from '@soer/soer-components';
import {
  DataStoreService,
  deSerializeDtoPackWihJson,
  DtoPackWithStatus,
  extractDtoPackFromBusWithErrors,
  SerializedJsonModel,
} from '@soer/sr-dto';
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
  data$: Observable<DtoPackWithStatus<VideoLink>>;
  private linkId;

  constructor(private store$: DataStoreService, private route: ActivatedRoute) {
    this.linkId = this.route.snapshot.data['link'];
    this.data$ = deSerializeDtoPackWihJson<VideoLink>(
      extractDtoPackFromBusWithErrors<SerializedJsonModel>(this.store$.of(this.linkId))
    );
  }
}
