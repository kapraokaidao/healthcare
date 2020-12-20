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

export function toPagination<T>(
  data: T[],
  totalCount: number,
  options: PaginationOptions
): Pagination<T> {
  const pageCount = Math.ceil(totalCount / options.pageSize);
  return {
    data,
    itemCount: data.length,
    page: options.page,
    pageSize: options.pageSize,
    totalCount,
    pageCount,
  };
}
