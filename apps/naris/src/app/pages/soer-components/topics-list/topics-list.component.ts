import { Component, Input } from '@angular/core';

@Component({
  selector: 'soer-topics-list',
  templateUrl: './topics-list.component.html',
  styleUrls: ['./topics-list.component.scss'],
})
export class TopicsListComponent {
  @Input() topics: { overview: string; title: string }[] = [];
}
