import { AfterViewInit, ChangeDetectorRef, Component, DoCheck, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'soer-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements AfterViewInit, DoCheck {
  public isNeedShowLeftArrow = false;
  public isNeedShowRightArrow = false;
  @ViewChild('container') container!: ElementRef;
  @Input() header = '';

  public constructor(private cdr: ChangeDetectorRef) {}

  ngDoCheck(): void {
    this.calculateIsNeedShowArrow();
  }

  ngAfterViewInit(): void {
    this.container.nativeElement.scrollLeft = 0;
  }

  public onArrowClick(countItemsToMove: number) {
    if (this.container.nativeElement.children[0]) {
      this.container.nativeElement.scrollLeft +=
        countItemsToMove * this.container.nativeElement.children[0].offsetWidth;
      this.cdr.markForCheck();
    }
  }

  private calculateIsNeedShowArrow(): void {
    this.isNeedShowLeftArrow = this.container?.nativeElement?.scrollLeft > 0;
    this.isNeedShowRightArrow =
      this.container?.nativeElement?.scrollLeft < this.container?.nativeElement?.scrollLeftMax;
  }
}
