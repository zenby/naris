import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoSource } from '@soer/soer-components';
import {
  DataStoreService,
  deSerializeDtoPackWihJson,
  deSerializeJson,
  DtoPack,
  DtoPackWithStatus,
  extractDtoPackFromBus,
  extractDtoPackFromBusWithErrors,
  extractDtoPackStatusFromBus,
  OK,
  SerializedJsonModel,
} from '@soer/sr-dto';
import { BehaviorSubject, Observable, map } from 'rxjs';

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
  //  links$: Observable<VideoLink[]>;
  data$: Observable<DtoPackWithStatus<VideoLink>>;
  private linkId;
  constructor(private store$: DataStoreService, private route: ActivatedRoute) {
    this.linkId = this.route.snapshot.data['link'];
    this.data$ = deSerializeDtoPackWihJson<VideoLink>(
      extractDtoPackFromBusWithErrors<SerializedJsonModel>(this.store$.of(this.linkId))
    );
    /*    this.links$ = deSerializeJson<VideoLink>(
      extractDtoPackFromBus<SerializedJsonModel>(
        this.store$.of(this.linkId).pipe(tap(
          data => { 
            this.status$.next(data.payload.status);
            switch(data.payload.status) {
              case ERROR: 
                this.errors$.next(data.payload.items);
              break;
              case INIT:
                this.errors$.next(['INIT']);
              break;
              default:
                  this.errors$.next([]);
            }
         }
        ))
      )
    );*/
  }
}
