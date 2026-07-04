export interface ApiPaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApiSingleResponse<T> {
  data: T;
  message?: string;
}
