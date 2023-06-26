import { VideoSource } from '@soer/soer-components';

export type VideoIdAndSource = {
  id?: string;
  source: VideoSource;
};
export interface WatchedVideo {
  activityId?: string;
  videoId: string;
  title: string;
  date: string;
}
