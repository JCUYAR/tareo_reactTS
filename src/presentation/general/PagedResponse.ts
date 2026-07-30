import type { BaseResult } from "./BaseResult";

export interface PagedResponse<T> extends BaseResult<T> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}