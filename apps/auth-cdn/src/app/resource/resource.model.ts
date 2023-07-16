export type Resource = {
  title: string;
  // url: string;
  children?: Resource[];
};

export type ResourceFilter = {
  folder: string;
  filename: string;
};
