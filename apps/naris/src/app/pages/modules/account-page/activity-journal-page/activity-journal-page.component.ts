import { Component } from '@angular/core';
import { VideoService } from '../../../../services/video/video.service';
import { WatchedVideo } from '../../../../services/video/video.models';
import { BehaviorSubject, map } from 'rxjs';
import { formatDate } from '@angular/common';
import { ConfirmData, ConfirmService } from '@soer/soer-components';
import { PersonalActivityRaw, PersonalActivityService } from '../../../../api/progress/personal-activity.service';

export interface Activity {
  id: string;
  fields: Array<string | number>;
  actions: {
    title: string;
    handler: (id?: string) => void;
  }[];
}

@Component({
  selector: 'soer-activity-journal-page',
  templateUrl: './activity-journal-page.component.html',
  styleUrls: ['./activity-journal-page.component.scss'],
})
export class ActivityJournalPageComponent {
  public activities$: BehaviorSubject<Activity[]>;
  private personalActivity: PersonalActivityRaw[] = [];

  constructor(
    private videoService: VideoService,
    private confirmService: ConfirmService,
    private personalActivityService: PersonalActivityService
  ) {
    this.personalActivityService.activityRaw$.subscribe((data) => (this.personalActivity = data));
    this.confirmService.onConfirm$.subscribe((data: ConfirmData) => this.deleteActivity(data));
    this.activities$ = new BehaviorSubject<Activity[]>([]);
    this.videoService
      .getWatchedVideos()
      .pipe(map((videos) => this.convertToActivity(videos)))
      .subscribe(this.activities$);
  }

  private convertToActivity(videos: WatchedVideo[]) {
    return videos
      .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
      .map(
        (video) =>
          ({
            id: video.activityId,
            fields: [`Просмотрено видео ${video.title}`, formatDate(video.date, 'dd.MM.yyyy hh:mm:ss', 'en')],
            actions: [
              {
                title: 'Удалить',
                handler: (id: string) => {
                  this.confirmService.show({
                    title: 'Удалить запись?',
                    content: 'Это действие необратимо.',
                    data: {
                      id,
                    },
                  });
                },
              },
            ],
          } as Activity)
      );
  }

  private deleteActivity(data: ConfirmData) {
    const activity = this.personalActivity.find((item) => item.id == data['id']);
    if (activity === undefined) {
      throw new Error('Can`t find activity for deleting with id: ' + data['id']);
    }

    this.personalActivityService.remove(activity);
  }
}
