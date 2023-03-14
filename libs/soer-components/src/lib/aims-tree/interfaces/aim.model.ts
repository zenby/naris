export interface AimModel {
  id?: number | string;
  title: string;
  overview: string;
  progress: number;
  tasks: AimModel[];
}

export const EMPTY_AIM = {
  id: 0,
  title: '',
  overview: '',
  progress: 0,
  tasks: [],
};
