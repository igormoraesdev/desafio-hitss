import { Prisma } from 'src/generated/prisma/client';
import { TaskFilters, TaskSort } from 'src/modules/tasks/task-filters';

export const toIdRefs = (ids: number[]) => ids.map((id) => ({ id }));

export const buildWhere = ({
  status,
  teamId,
  search,
}: TaskFilters): Prisma.TasksWhereInput => {
  return {
    status,
    teams: teamId ? { some: { id: teamId } } : undefined,
    title: search
      ? { contains: search, mode: Prisma.QueryMode.insensitive }
      : undefined,
  };
};

export const buildOrderBy = ({
  field,
  order,
}: TaskSort): Prisma.TasksOrderByWithRelationInput[] => {
  return [{ [field]: order }, { id: 'asc' }];
};
