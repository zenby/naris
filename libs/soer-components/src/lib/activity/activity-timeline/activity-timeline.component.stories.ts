import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { ActivityEventModel } from '../activity-event-model';
import { ActivityModule } from '../activity.module';
import { ActivityTimelineComponent } from './activity-timeline.component';

export default {
  title: 'ActivityTimelineComponent',
  component: ActivityTimelineComponent,
  decorators: [
    moduleMetadata({
      imports: [ActivityModule, BrowserAnimationsModule],
    }),
  ],
} as Meta<ActivityTimelineComponent>;

const videos: ActivityEventModel[] = Array(20)
  .fill(1)
  .map((item, i) => {
    return {
      title: `Просмотрено видео #${i + 1}`,
      date: new Date(
        new Date().setDate(new Date().getDate() - 20 - ((i % 3) - Math.floor(Math.random() * 20)))
      ).toISOString(),
    };
  });

export const Primary: StoryFn = () => ({
  props: {
    activitiesEvents: videos,
  },
});
