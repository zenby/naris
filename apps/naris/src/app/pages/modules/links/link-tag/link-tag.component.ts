import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { AppPageLink } from '@soer/sr-common-interfaces';

@Component({
  selector: 'soer-link-tag',
  templateUrl: './link-tag.component.html',
  styleUrls: ['./link-tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkTagComponent {
  @Input() pageLink: AppPageLink = { label: '', linkType: '', value: -1 };
  @Output() action = new EventEmitter<AppPageLink>();
  parseTag(): void {
    /*    const [prefix, tagType, uri, title] = this.tagSrc.split(':');
    if (prefix === 'l') {
      this.uri = uri;
      this.title = title;
    }*/
  }
}
