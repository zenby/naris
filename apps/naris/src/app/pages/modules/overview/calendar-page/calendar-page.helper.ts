import { ActivityEventModel } from '@soer/soer-components';
import { WatchedVideo } from '../../../../services/video/video.models';

export class CalendarPageHelper {
  public static mapWatchedVideosToActivities(videos: WatchedVideo[]): ActivityEventModel[] {
    return videos.map((video: WatchedVideo) => this.mapWatchedVideoModelToActivityEventModel(video));
  }

  private static mapWatchedVideoModelToActivityEventModel(video: WatchedVideo): ActivityEventModel {
    const activityEvent: ActivityEventModel = {
      title: `Просмотрено видео ${video.title}`,
      date: video.date,
    };

    return activityEvent;
  }
}
