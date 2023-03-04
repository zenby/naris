import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { BusEmitter, BusMessage } from '@soer/mixed-bus';
import { DataStoreService, DtoPack } from '@soer/sr-dto';
import { WorkbookModel } from '@soer/sr-editor';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { parseJsonDTOPack } from '../../../../api/json.dto.helpers';
import { MetricModel } from '../../../../api/metrics/metric.model';
import { PersonalActivityService, VideoIdModel } from '../../../../api/progress/personal-activity.service';
import { QuestionModel } from '../../../../api/questions/question.model';
import { VideoModel } from '../../../../api/streams/stream.model';
import { TargetModel } from '../../../../api/targets/target.interface';

@Component({
  selector: 'soer-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
})
export class MetricsComponent {
  public metrics: Promise<MetricModel[]>;
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

    const countVideosIn = (videos: VideoModel[], watchedVideos: VideoIdModel[]): number => {
      const onlyIds = watchedVideos.map((video) => video.videoId);
      const onlyWatchedVideos = videos.filter((video) =>
        onlyIds.includes(video.vimeo_id || video.youtube_id || video.kinescope_id || '')
      );
      const length = onlyWatchedVideos.reduce(
        (acc: number, item) => acc + (item.children ? item.children.length : 1),
        0
      );
      return length;
    };

    this.metrics = new Promise(async (resolve) => {
      resolve([
        {
          title: 'Цели',
          value: (await firstValueFrom(this.target$)).items.length,
          icon: 'check-circle',
          url: '#!/pages/targets/list',
        },
        {
          title: 'Конспекты',
          value: (await firstValueFrom(this.workbook$)).items.length,
          icon: 'solution',
          url: '#!/pages/workbook',
        },
        {
          title: 'Вопросы',
          value: (await firstValueFrom(this.question$)).items.length,
          icon: 'question',
          url: '#!/pages/qa',
        },
        {
          title: 'Стримы',
          value: countVideosIn(videosFlatMap(this.data['streams']), this.personalActivity.getWatchedVideos()),
          icon: 'play-circle',
          url: '#!/pages/streams',
        },
        {
          title: 'Воркшопы',
          value: countVideosIn(videosFlatMap(this.data['workshops']), this.personalActivity.getWatchedVideos()),
          icon: 'experiment',
          url: '#!/pages/workshops',
        },
        {
          title: 'Книга',
          value: 57,
          suffix: '%',
          icon: 'book',
          url: '#!/pages/book',
        },
        {
          title: 'Исходники',
          value: 6,
          icon: 'field-binary',
          url: '#!/pages/sources',
        },
      ]);
    });
  }
}
