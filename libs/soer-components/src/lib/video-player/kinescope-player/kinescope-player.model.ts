export type KinescopePlayer = {
  setPlaybackRate: (speed: number) => void;
  destroy: () => void;
  once: (event: string, handler: () => void) => void;
  on: (event: string, handler: (value: { data: { playbackRate: number } }) => void) => void;
  Events: {
    Ready: string;
    PlaybackRateChange: string;
  };
};
