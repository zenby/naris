import { BlocksDocumentModel } from '@soer/sr-editor';

export interface PersonalTarget {
  id?: number;
  title: string;
  overview: string;
  activity: string;
  tasks: RoadmapTask[];
}

export interface TargetModel extends BlocksDocumentModel {
  id?: number;
  title: string;
  overview: string;
  progress: number;
  linkVideoId?: number;
  tasks: TargetModel[];
}

export interface TemplateModel extends BlocksDocumentModel {
  id?: number;
  title: string;
  overview: string;
  progress: number;
  tasks: TemplateModel[];
}
export interface RoadmapTask {
  title: string;
  progress: number;
  file?: string;
  children: RoadmapTask[];
}

export const EMPTY_TARGET: TargetModel = {
  id: -1,
  title: '',
  overview: '',
  progress: 0,
  tasks: [],
  blocks: [{ text: '', type: 'markdown' }],
};

export interface Visibility {
  [id: string]: boolean;
}
