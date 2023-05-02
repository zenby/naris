import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'soer-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  @Input() dateFullCell?: TemplateRef<{ $implicit: Date }>;
}
