import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Paginated, paginate } from 'src/common/pagination/pagination';
import { PaginationQueryDto } from 'src/common/pagination/pagination-query.dto';
import { Tasks } from 'src/generated/prisma/client';
import { TeamsService } from '../teams/teams.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  TASKS_REPOSITORY,
  TasksRepository,
} from './repositories/tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASKS_REPOSITORY) private readonly repository: TasksRepository,
    @InjectPinoLogger(TasksService.name) private readonly logger: PinoLogger,
    private readonly teamsService: TeamsService,
  ) {}

  async create(dto: CreateTaskDto): Promise<Tasks> {
    await this.verifyTeams(dto.teamIds);
    const task = await this.repository.create(dto);
    this.logger.info(
      { taskId: task.id, teamIds: dto.teamIds ?? [] },
      'Task criada',
    );
    return task;
  }

  async findAll(query: PaginationQueryDto): Promise<Paginated<Tasks>> {
    this.logger.debug(
      { page: query.page, limit: query.limit },
      'Listando tasks',
    );
    const result = await this.repository.findAll(query.toPageParams());
    return paginate(result, query);
  }

  async findOne(id: number): Promise<Tasks> {
    const task = await this.repository.findById(id);
    if (!task) {
      this.logger.warn({ taskId: id }, 'Task não encontrada');
      throw new NotFoundException(`Task ${id} não encontrada`);
    }
    return task;
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Tasks> {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Informe ao menos um campo para atualizar');
    }
    await this.findOne(id);
    await this.verifyTeams(dto.teamIds);
    const updated = await this.repository.update(id, dto);
    this.logger.info(
      { taskId: id, fields: Object.keys(dto) },
      'Task atualizada',
    );
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.repository.remove(id);
    this.logger.info({ taskId: id }, 'Task removida');
  }

  private async verifyTeams(teamIds?: number[]): Promise<void> {
    if (teamIds && teamIds.length > 0) {
      await this.teamsService.ensureAllExist(teamIds);
    }
  }
}
