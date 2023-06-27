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
    // делаем скрытый элемент для textarea чтобы знать всегда высоту текста
    const heightText = this.element.nativeElement.children[2].scrollHeight;
    const heightPreview = this.element.nativeElement.children[1].scrollHeight;
    this.element.nativeElement.style.height = Math.max(heightText, heightPreview) + 2 + 'px';
  }
}
