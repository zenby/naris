import { Component, Input } from '@angular/core';

import { ListItem } from './list.model';

@Component({
  selector: 'soer-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  @Input() items: ListItem[] = [];
}
