import { WatchedVideo } from '../../../../services/video/video.models';

export type ActivityModel = Pick<WatchedVideo, 'date' | 'title'>;
