import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { CarouselComponent } from './carousel.component';
import { CommonModule } from '@angular/common';
import { CarouselModule } from './carousel.module';

const meta: Meta<typeof CarouselComponent> = {
  title: 'Libs/Components/CarouselComponent',
  component: CarouselComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, CarouselModule],
    }),
  ],
};

export default meta;

const itemStyle = 'display:flex; align-items: center; justify-content: center; background-color: #eee; height: 400px;';

const PrimaryTemplate: StoryFn<CarouselComponent> = (args: CarouselComponent) => ({
  props: args,
  template: `
  <soer-carousel header="${args.header}">
    <div class="carousel-item"><div style="${itemStyle};"><h1>1</h1></div></div>
    <div class="carousel-item"><div style="${itemStyle};"><h1>2</h1></div></div>
    <div class="carousel-item"><div style="${itemStyle};"><h1>3</h1></div></div>
    <div class="carousel-item"><div style="${itemStyle};"><h1>4</h1></div></div>
    <div class="carousel-item"><div style="${itemStyle};"><h1>5</h1></div></div>
    <div class="carousel-item"><div style="${itemStyle};"><h1>6</h1></div></div>
  </soer-carousel>`,
});

export const Primary = PrimaryTemplate.bind({});
Primary.args = {
  header: 'Primary',
} as unknown as Partial<CarouselComponent>;
