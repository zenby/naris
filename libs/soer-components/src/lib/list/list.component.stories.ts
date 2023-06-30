import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ListModule } from './list.module';

const meta: Meta<typeof ListComponent> = {
  title: 'Libs/Components/ListComponent',
  component: ListComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ListModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<typeof ListComponent>;

export const Primary: Story = {
  args: {
    items: Array(5)
      .fill(1)
      .map((item, i) => {
        return {
          id: i.toString(),
          fields: [`field ${i + 1}.1`, `field ${i + 1}.2`, `field ${i + 1}.3`],
          actions: [
            {
              title: 'Удалить',
              handler: (id?: string) => {
                alert(id);
              },
            },
          ],
        };
      }),
  } as unknown as Partial<typeof ListComponent>,
};

export const WithoutActions: Story = {
  args: {
    items: Array(6)
      .fill(1)
      .map((item, i) => {
        return {
          id: i.toString(),
          fields: [`field ${i + 1}.1`, `field ${i + 1}.2`, `field ${i + 1}.3`],
          actions: [],
        };
      }),
  } as unknown as Partial<typeof ListComponent>,
};

export const WithDeleteAndEditActions: Story = {
  args: {
    items: Array(4)
      .fill(1)
      .map((item, i) => {
        return {
          id: i.toString(),
          fields: [`field ${i + 1}.1`, `field ${i + 1}.2`, `field ${i + 1}.3`],
          actions: [
            {
              title: 'Удалить',
              handler: (id?: string) => {
                alert(id);
              },
            },
            {
              title: 'Редактировать',
              handler: (id?: string) => {
                alert(id);
              },
            },
          ],
        };
      }),
  } as unknown as Partial<typeof ListComponent>,
};
