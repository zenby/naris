import { Type } from '@angular/core';
import { BasicBlockComponent } from './basic-block.component';

export type EditorBlocksRegistry = Record<'markdown' | 'test' | 'code', Type<BasicBlockComponent>>;
