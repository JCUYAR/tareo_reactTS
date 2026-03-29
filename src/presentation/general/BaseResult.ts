export interface BaseResult<T> {
  success: boolean;
  data: T[];
  errors: string[];
}