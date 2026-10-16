import { PageParams, PageResult } from 'src/common/pagination/pagination';
import { Tasks } from 'src/generated/prisma/client';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

export const TASKS_REPOSITORY = Symbol('TASKS_REPOSITORY');

export interface TasksRepository {
  create(data: CreateTaskDto): Promise<Tasks>;
  findAll(params: PageParams): Promise<PageResult<Tasks>>;
  findById(id: number): Promise<Tasks | null>;
  update(id: number, data: UpdateTaskDto): Promise<Tasks>;
  remove(id: number): Promise<void>;
}
