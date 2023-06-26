import { MobileMenuComponent } from './mobile-menu.component';
import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { MAIN_MENU } from '../../../services/menu/menu.const';
import { HttpClientModule } from '@angular/common/http';
import { DemoNgZorroAntdModule } from '@soer/soer-components';
import { RouterTestingModule } from '@angular/router/testing';

export default {
  title: 'Naris/Components/MobileMenuComponent',
  component: MobileMenuComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterTestingModule, DemoNgZorroAntdModule, HttpClientModule],
    }),
  ],
} as Meta;

export const Primary: StoryFn = () => ({
  props: {
    isMobile: true,
    applicationMenu: MAIN_MENU,
  },
});
