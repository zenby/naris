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
    const shadowText = this.element.nativeElement.children[2];
    const mainText = this.element.nativeElement.children[0];

    shadowText.value = mainText.value;
    const heightText = shadowText.scrollHeight;

    this.element.nativeElement.style.height = heightText + 2 + 'px';
  }
}
