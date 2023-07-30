import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoSource } from '@soer/soer-components';
import { DataStoreService, deSerializeJson, extractDtoPackStatusFromBus, OK, SerializedJsonModel } from '@soer/sr-dto';
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
  links$: Observable<VideoLink[]>;
  errors$ = new BehaviorSubject<string[]>([]);
  status$: Observable<string[]>;
  private linkId;
  constructor(private store$: DataStoreService, private route: ActivatedRoute) {
    const dto$ = new BehaviorSubject<SerializedJsonModel[]>([]);

    this.linkId = this.route.snapshot.data['link'];
    this.status$ = extractDtoPackStatusFromBus<SerializedJsonModel>(this.store$.of(this.linkId), dto$, this.errors$);
    this.links$ = deSerializeJson<VideoLink>(dto$.pipe(map((items) => ({ status: OK, items }))));
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
