import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'soer-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
})
export class OverlayComponent {
  @Input() activate = true;
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() readonly close = new EventEmitter<void>();

  clickOnOverlay(event: MouseEvent): void {
    if ((event?.target as HTMLDivElement).id === 'overlay') {
      this.close.emit();
    }
  }
}
