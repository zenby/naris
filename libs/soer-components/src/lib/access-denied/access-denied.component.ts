import { Component, Input } from '@angular/core';

@Component({
  selector: 'soer-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss'],
})
export class AccessDeniedComponent {
  @Input() errors: string[] = [];
}
