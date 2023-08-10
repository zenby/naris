import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'soer-popup-content',
  templateUrl: './popup-content.component.html',
  styleUrls: ['./popup-content.component.scss'],
})
export class PopupContentComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  onClose(): void {
    const queryParams = this.route.snapshot.queryParams;
    this.router.navigate(['.'], { relativeTo: this.route.parent, queryParams });
  }
}
