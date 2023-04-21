import { Component, Input } from '@angular/core';

@Component({
  selector: 'soer-thumbnail-card',
  templateUrl: './thumbnail-card.component.html',
  styleUrls: ['./thumbnail-card.component.scss'],
})
export class ThumbnailCardComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() img = '';
}
