import { MobileMenuComponent } from './mobile-menu.component';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { MAIN_MENU } from '../../../services/menu/menu.const';
import { DemoNgZorroAntdModule } from '../../demo.module';
import { HttpClientModule } from '@angular/common/http';

export default {
  title: 'mobile-menu',
  component: MobileMenuComponent,
  decorators: [
    moduleMetadata({
      imports: [DemoNgZorroAntdModule, HttpClientModule],
    }),
  ],
} as Meta<MobileMenuComponent>;

const Template: Story<MobileMenuComponent> = (args: MobileMenuComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  isMobile: true,
  applicationMenu: MAIN_MENU,
};
