export interface PageParams {
  skip: number;
  take: number;
}

export interface PageResult<T> {
  items: T[];
  total: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export function paginate<T>(
  result: PageResult<T>,
  { page, limit }: { page: number; limit: number },
): Paginated<T> {
  return {
    data: result.items,
    meta: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
    },
  };
}
