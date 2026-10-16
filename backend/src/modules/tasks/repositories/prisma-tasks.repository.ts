import { Injectable } from '@nestjs/common';
import { PageResult } from 'src/common/pagination/pagination';
import { buildOrderBy, buildWhere, toIdRefs } from 'src/common/utils/filters';
import { Tasks } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { FindTasksOptions, TasksRepository } from './tasks.repository';

@Injectable()
export class PrismaTasksRepository implements TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  create({ teamIds, ...data }: CreateTaskDto): Promise<Tasks> {
    return this.prisma.tasks.create({
      data: {
        ...data,
        teams: teamIds ? { connect: toIdRefs(teamIds) } : undefined,
      },
      include: { teams: true },
    });
  }

  async findAll({
    filters,
    sort,
    page,
  }: FindTasksOptions): Promise<PageResult<Tasks>> {
    const where = buildWhere(filters);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.tasks.findMany({
        where,
        skip: page.skip,
        take: page.take,
        include: { teams: true },
        orderBy: buildOrderBy(sort),
      }),
      this.prisma.tasks.count({ where }),
    ]);
    return { items, total };
  }

  findById(id: number): Promise<Tasks | null> {
    return this.prisma.tasks.findUnique({
      where: { id },
      include: { teams: true },
    });
  }

  update(id: number, { teamIds, ...data }: UpdateTaskDto): Promise<Tasks> {
    return this.prisma.tasks.update({
      where: { id },
      data: {
        ...data,
        teams: teamIds ? { set: toIdRefs(teamIds) } : undefined,
      },
      include: { teams: true },
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.tasks.delete({ where: { id } });
  }
}
