import { Injectable } from '@nestjs/common';
import { PageParams, PageResult } from 'src/common/pagination/pagination';
import { Tasks } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TasksRepository } from './tasks.repository';

const toIdRefs = (ids: number[]) => ids.map((id) => ({ id }));

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

  async findAll({ skip, take }: PageParams): Promise<PageResult<Tasks>> {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.tasks.findMany({
        skip,
        take,
        include: { teams: true },
        orderBy: { title: 'asc' },
      }),
      this.prisma.tasks.count(),
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
