import { WathcedVideo } from '../../../../services/video/video.service';
import { ActivityModel } from './activity-model';

export class CalendarPageHelper {
  public static mapWatchedVideosToActivities(videos: WathcedVideo[]): ActivityModel[] {
    return videos.map((video: WathcedVideo) => this.mapWatchedVideoModelToActivityModel(video));
  }

  private static mapWatchedVideoModelToActivityModel(video: WathcedVideo): ActivityModel {
    const activityModel: ActivityModel = {
      title: `Просмотрено видео ${video.title}`,
      date: video.date,
    };

    return activityModel;
  }
}
