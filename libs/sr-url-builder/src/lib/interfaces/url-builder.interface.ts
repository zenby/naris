export interface UrlBuilderOptions {
  apiRoot: string;
  narisApiUrl?: string;
}

export interface UrlParam {
  [key: string]: number | string;
}
