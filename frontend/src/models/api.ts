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

type Sort = "title" | "status" | "createdAt" | "updatedAt";

type Order = "asc" | "desc";

type Status = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export type FilterParams = {
  page?: number;
  limit?: number;
  teamId?: number;
  status?: Status;
  search?: string;
  sortBy?: Sort;
  order?: Order;
};
