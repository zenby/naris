import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { ListModule } from './list.module';
import { ListItem } from './list.model';

export default {
  title: 'ListComponent',
  component: ListComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ListModule],
    }),
  ],
} as Meta<ListComponent>;

const items: ListItem[] = Array(5)
  .fill(1)
  .map((item, i) => {
    return {
      id: i.toString(),
      fields: [`field ${i + 1}.${i + 1}`, `field ${i + 1}.${i + 2}`, `field ${i + 1}.${i + 3}`],
      actions: [
        {
          title: 'Удалить',
          handler: (id?: string) => {
            alert(id);
          },
        },
      ],
    };
  });

export const Primary: StoryFn = () => ({
  props: {
    items,
  },
});
