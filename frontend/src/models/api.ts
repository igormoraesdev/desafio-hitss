export type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  data: T;
  meta?: Meta;
};
