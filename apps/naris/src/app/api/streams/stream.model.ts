export interface VideoModel {
  vimeo_id?: string;
  kinescope_id?: string;
  youtube_id?: string;
  thumb_url?: string;
  title: string;
  desc: string;
  children?: VideoModel[];
}
