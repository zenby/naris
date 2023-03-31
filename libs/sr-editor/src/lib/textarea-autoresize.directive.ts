import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[soerAutoresize]', // Attribute selector
})
export class TextareaAutoresizeDirective implements OnInit {
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
    this.element.nativeElement.style.height = this.element.nativeElement.children[0].scrollHeight - 50 + 'px';
    this.element.nativeElement.style.height = this.element.nativeElement.children[0].scrollHeight + 10 + 'px';
  }
}
