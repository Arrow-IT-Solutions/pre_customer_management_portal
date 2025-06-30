export interface RequestBase {
  uuid?: string;
  pageIndex?: string;
  pageSize?: string;
  fromDate?: string;
  toDate?: string;
}

export interface ResponseBase {
  httpMethod?: string;
  language?: string;
  requestStatus?: string;
  requestMessage?: string;
}

export interface SearchRequestBase {
  id?: string;
  pageIndex?: string;
  pageSize?: string;
  fromDate?: string;
  toDate?: string;
}
export interface TranslationBase {
  language?: string;
}
