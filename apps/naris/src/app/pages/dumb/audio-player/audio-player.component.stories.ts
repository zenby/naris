import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { AudioPlayerComponent } from './audio-player.component';

export default {
  title: 'AudioPlayerComponent',
  component: AudioPlayerComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<AudioPlayerComponent>;

const Template: Story<AudioPlayerComponent> = (args: AudioPlayerComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  speed: 0.5,
};
