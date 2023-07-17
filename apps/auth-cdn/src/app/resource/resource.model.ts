export type Resource = {
  title: string;
  // url: string;
  children?: Resource[];
};

export type ResourceFilter = {
  folder: string;
  filename: string;
};

export type FileData = {
  filename: string;
  folders: string[];
  path: string;
  fileMultipartData: [Buffer, Record<string, string>];
};
