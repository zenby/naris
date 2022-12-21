import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'soer-code-block',
  templateUrl: './code-block.component.html',
  styleUrls: ['./code-block.component.scss'],
})
export class CodeBlockComponent implements OnInit {
  @Input() text = '';

  constructor() {}

  ngOnInit(): void {}
}
