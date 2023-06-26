export type ListAction = {
  title: string;
  handler: (id?: string) => void;
};

export interface ListItem {
  id?: string;
  fields: Array<string | number>;
  actions: ListAction[];
}
