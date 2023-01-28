import { Type } from '@angular/core';
import { BasicBlockComponent } from './components/basic-block.component';
import { TextBlockType } from './interfaces/document.model';

export type EditorBlocksRegistry = Record<TextBlockType, Type<BasicBlockComponent>>;

export const EDITOR_BLOCKS_REGISTRY_TOKEN = Symbol('EDITOR_BLOCKS_REGISTRY_TOKEN');
