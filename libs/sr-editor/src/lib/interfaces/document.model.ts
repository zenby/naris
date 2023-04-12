export type TextBlockType = 'markdown' | 'test' | 'presentation' | 'code' | 'diagram';

export interface TextBlock {
  type: TextBlockType;
  text: string;
}

export interface WorkbookModel {
  id?: number | null;
  question: string;
  text?: string;
  blocks: TextBlock[];
}

export const EMPTY_WORKBOOK: WorkbookModel = {
  id: null,
  question: '',
  blocks: [{ text: '', type: 'markdown' }],
};

export interface DelimitEvent {
  text: string;
  type: TextBlockType;
}
