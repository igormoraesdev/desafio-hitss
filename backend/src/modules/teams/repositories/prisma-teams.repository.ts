import { Injectable } from '@nestjs/common';
import { PageResult } from '../../../common/pagination/pagination';
import { Prisma, Teams } from '../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTeamDto } from '../dto/create-team.dto';
import { UpdateTeamDto } from '../dto/update-team.dto';
import { FindTeamsOptions, TeamsRepository } from './teams.repository';

@Injectable()
export class PrismaTeamsRepository implements TeamsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateTeamDto): Promise<Teams> {
    return this.prisma.teams.create({ data });
  }

  async findAll({
    filters,
    page: { skip, take },
  }: FindTeamsOptions): Promise<PageResult<Teams>> {
    const where: Prisma.TeamsWhereInput = {
      name: filters.search
        ? { contains: filters.search, mode: Prisma.QueryMode.insensitive }
        : undefined,
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.teams.findMany({
        where,
        skip,
        take,
        include: { tasks: true },
        orderBy: { name: 'asc' },
      }),
      this.prisma.teams.count({ where }),
    ]);
    return { items, total };
  }

  findById(id: number): Promise<Teams | null> {
    return this.prisma.teams.findUnique({ where: { id } });
  }

  findByName(name: string): Promise<Teams | null> {
    return this.prisma.teams.findUnique({ where: { name } });
  }

  findManyByIds(ids: number[]): Promise<Teams[]> {
    return this.prisma.teams.findMany({ where: { id: { in: ids } } });
  }

  update(id: number, data: UpdateTeamDto): Promise<Teams> {
    return this.prisma.teams.update({ where: { id }, data });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.teams.delete({ where: { id } });
  }
}
