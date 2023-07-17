import { Component, Input } from '@angular/core';
import { ActivityEventModel } from '../activity-event-model';

@Component({
  selector: 'soer-activity-timeline',
  templateUrl: './activity-timeline.component.html',
  styleUrls: ['./activity-timeline.component.scss'],
})
export class ActivityTimelineComponent {
  @Input() activitiesEvents: ActivityEventModel[] = [];
}
