import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[soerAutoresize]', // Attribute selector
})
export class TextareaAutoresizeDirective implements OnInit {
  @Input('soerAutoresize') isEnabled = false;
  @HostListener('input', ['$event.target'])
  onInput(): void {
    this.adjust();
  }

  constructor(public element: ElementRef) {}

  ngOnInit(): void {
    if (this.element.nativeElement.scrollHeight) {
      requestAnimationFrame(() => this.adjust());
    }
  }

  adjust(): void {
    if (!this.isEnabled) return;
    this.element.nativeElement.style.height = this.element.nativeElement.children[0].scrollHeight + 2 + 'px';
  }
}
