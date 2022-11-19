import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';

@Component({
  selector: 'soer-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent  {
  @Input() size: NzButtonSize = 'small';
  @Input() actions: string[] = [];
  @Output() action: EventEmitter<string> = new EventEmitter<string>();
}
