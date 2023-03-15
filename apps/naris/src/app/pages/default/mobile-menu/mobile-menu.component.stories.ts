import { MobileMenuComponent } from './mobile-menu.component';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { MAIN_MENU } from '../../../services/menu/menu.const';
import { HttpClientModule } from '@angular/common/http';
import {DemoNgZorroAntdModule} from "@soer/soer-components";

export default {
  title: 'MobileMenuComponent',
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
