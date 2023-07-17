export type FolderResource = {
  title: string;
  children: Resource[];
};

export type FileResource = {
  title: string;
  url: string;
};

export type Resource = FolderResource | FileResource;

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

export function isFolderResource(resource: Resource): resource is FolderResource {
  return resource && 'children' in resource;
}
