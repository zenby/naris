import { Component, Input } from '@angular/core';

@Component({
  selector: 'soer-markdown-block',
  templateUrl: './markdown-block.component.html',
})
export class MarkdownBlockComponent {
  @Input() text = '';
}
