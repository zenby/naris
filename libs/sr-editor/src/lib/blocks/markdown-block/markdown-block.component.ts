import { Component, Input } from '@angular/core';
import { BasicBlockComponent } from '../basic-block.component';

@Component({
  selector: 'soer-markdown-block',
  templateUrl: './markdown-block.component.html',
})
export class MarkdownBlockComponent implements BasicBlockComponent {
  @Input() text = '';
}
