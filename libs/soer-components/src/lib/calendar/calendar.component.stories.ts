import { CommonModule, registerLocaleData } from '@angular/common';
import { importProvidersFrom } from '@angular/core';
import ru from '@angular/common/locales/ru';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Meta, StoryFn, applicationConfig } from '@storybook/angular';
import { NZ_I18N, ru_RU } from 'ng-zorro-antd/i18n';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { CalendarComponent, DayEvent } from './calendar.component';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { CalendarModule } from './calendar.module';

registerLocaleData(ru);

applicationConfig({
  providers: [{ provide: NZ_I18N, useValue: ru_RU }, importProvidersFrom(BrowserAnimationsModule)],
});

export default {
  title: 'CalendarComponent',
  component: CalendarComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, CalendarModule, NzCalendarModule, NzDropDownModule, BrowserAnimationsModule],
      providers: [{ provide: NZ_I18N, useValue: ru_RU }],
    }),
  ],
} as Meta<CalendarComponent>;

const videos: DayEvent[] = Array(20)
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
    dayEvents: videos,
  },
});
