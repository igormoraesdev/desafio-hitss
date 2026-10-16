import { Status } from 'src/generated/prisma/enums';

export const TASK_SORT_FIELDS = [
  'title',
  'status',
  'createdAt',
  'updatedAt',
] as const;
export const SORT_ORDERS = ['asc', 'desc'] as const;

export type TaskSortField = (typeof TASK_SORT_FIELDS)[number];
export type SortOrder = (typeof SORT_ORDERS)[number];

export interface TaskFilters {
  status?: Status;
  teamId?: number;
  search?: string;
}

export interface TaskSort {
  field: TaskSortField;
  order: SortOrder;
}
