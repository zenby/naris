export type TextBlockType = 'markdown' | 'test' | 'presentation' | 'code' | 'diagram';

export interface TextBlock {
  type: TextBlockType;
  text: string;
}

export interface BlocksDocumentModel {
  blocks: TextBlock[];
}
export interface WorkbookModel extends BlocksDocumentModel {
  id?: number | null;
  question: string;
  text?: string;
}

export const EMPTY_WORKBOOK: WorkbookModel = {
  id: null,
  question: '',
  blocks: [{ text: '', type: 'markdown' }],
};

export const EMPTY_DOCUMENT: BlocksDocumentModel = {
  blocks: [{ text: '', type: 'markdown' }],
};

export interface DelimitEvent {
  text: string;
  type: TextBlockType;
}
