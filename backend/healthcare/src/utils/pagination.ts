export interface Pagination<T> {
  data: T[];
  itemCount;
  page: number;
  pageSize: number;
  totalCount: number;
  pageCount: number;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}
