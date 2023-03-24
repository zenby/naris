import { Component, Input } from '@angular/core';

export type ControlBtn = {
  title: string;
  icon: string;
  handler?: () => void;
};

@Component({
  selector: 'soer-block-editor-controls',
  templateUrl: './block-editor-controls.component.html',
  styleUrls: ['./block-editor-controls.component.scss'],
})
export class BlockEditorControlsComponent {
  @Input() controls: ControlBtn[] = [];
}
