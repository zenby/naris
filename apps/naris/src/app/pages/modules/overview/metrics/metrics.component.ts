import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { BusEmitter, BusMessage } from '@soer/mixed-bus';
import { DataStoreService, DtoPack } from '@soer/sr-dto';
import { WorkbookModel } from '@soer/sr-editor';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { parseJsonDTOPack } from '../../../../api/json.dto.helpers';
import { PersonalActivityService, VideoIdModel } from '../../../../api/progress/personal-activity.service';
import { QuestionModel } from '../../../../api/questions/question.model';
import { VideoModel } from '../../../../api/streams/stream.model';
import { TargetModel } from '../../../../api/targets/target.interface';

type ListItem = { items: { length: number } };

type Metric = {
  title: string;
  list$: Observable<ListItem>;
  icon: string;
  url: string;
  suffix?: string;
};

@Component({
  selector: 'soer-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
})
export class MetricsComponent {
  public metrics: Metric[];
  public target$: Observable<DtoPack<TargetModel>>;
  private workbook$: Observable<DtoPack<WorkbookModel>>;
  private question$: Observable<DtoPack<QuestionModel>>;
  private data: Data;

  constructor(
    private route: ActivatedRoute,
    @Inject('workbooks') private workbooksIdEmitter: BusEmitter,
    @Inject('targets') private targetsIdEmitter: BusEmitter,
    @Inject('questions') private questionsIdEmitter: BusEmitter,
    private personalActivity: PersonalActivityService,
    private store$: DataStoreService
  ) {
    this.data = this.route.snapshot.data;
    this.workbook$ = parseJsonDTOPack<WorkbookModel>(this.store$.of(this.workbooksIdEmitter), 'workbooks');
    this.target$ = parseJsonDTOPack<TargetModel>(this.store$.of(this.targetsIdEmitter), 'targets');
    this.question$ = this.store$
      .of(this.questionsIdEmitter)
      .pipe(map<BusMessage, DtoPack<QuestionModel>>((data) => data.payload));

    const videosFlatMap = (videos: VideoModel[]): VideoModel[] => {
      return videos.reduce((acc: VideoModel[], item: VideoModel) => [...acc, ...(item.children || [])], []);
    };

    const countVideosIn = (videos: VideoModel[], watchedVideos: VideoIdModel[]): ListItem => {
      const onlyIds = watchedVideos.map((video) => video.videoId);
      const onlyWatchedVideos = videos.filter((video) =>
        onlyIds.includes(video.vimeo_id || video.youtube_id || video.kinescope_id || '')
      );
      const length = onlyWatchedVideos.reduce(
        (acc: number, item) => acc + (item.children ? item.children.length : 1),
        0
      );
      return {
        items: { length },
      };
    };

    this.metrics = [
      {
        title: 'Цели',
        list$: this.target$,
        icon: 'check-circle',
        url: '#!/pages/targets/list',
      },
      {
        title: 'Конспекты',
        list$: this.workbook$,
        icon: 'solution',
        url: '#!/pages/workbook',
      },
      {
        title: 'Вопросы',
        list$: this.question$,
        icon: 'question',
        url: '#!/pages/qa',
      },
      {
        title: 'Стримы',
        list$: of(countVideosIn(videosFlatMap(this.data['streams']), this.personalActivity.getWatchedVideos())),
        icon: 'play-circle',
        url: '#!/pages/streams',
      },
      {
        title: 'Воркшопы',
        list$: of(countVideosIn(videosFlatMap(this.data['workshops']), this.personalActivity.getWatchedVideos())),
        icon: 'experiment',
        url: '#!/pages/workshops',
      },
      {
        title: 'Книга',
        list$: of({ items: { length: 57 } }),
        suffix: '%',
        icon: 'book',
        url: '#!/pages/book',
      },
      {
        title: 'Исходники',
        list$: of({ items: { length: 6 } }),
        icon: 'field-binary',
        url: '#!/pages/sources',
      },
    ];
  }
}
