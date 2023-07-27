import { BlocksDocumentModel } from '@soer/sr-editor';

export interface AimModel extends BlocksDocumentModel {
  id?: number | string;
  title: string;
  overview: string;
  linkVideoId?: number;
  progress: number;
  tasks: AimModel[];
}

export const EMPTY_AIM: AimModel = {
  id: 0,
  title: '',
  overview: '',
  progress: 0,
  tasks: [],
  blocks: [{ text: '', type: 'markdown' }],
};
