import { PageParams, PageResult } from 'src/common/pagination/pagination';
import { Tasks } from 'src/generated/prisma/client';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskFilters, TaskSort } from '../task-filters';

export const TASKS_REPOSITORY = Symbol('TASKS_REPOSITORY');

export interface FindTasksOptions {
  filters: TaskFilters;
  sort: TaskSort;
  page: PageParams;
}

export interface TasksRepository {
  create(data: CreateTaskDto): Promise<Tasks>;
  findAll(options: FindTasksOptions): Promise<PageResult<Tasks>>;
  findById(id: number): Promise<Tasks | null>;
  update(id: number, data: UpdateTaskDto): Promise<Tasks>;
  remove(id: number): Promise<void>;
}
