import { Injectable } from '@nestjs/common';
import { PageResult } from '../../../common/pagination/pagination';
import { Prisma, Teams } from '../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTeamDto } from '../dto/create-team.dto';
import { UpdateTeamDto } from '../dto/update-team.dto';
import {
  FindTeamsOptions,
  TeamNameInUseError,
  TeamsRepository,
} from './teams.repository';

const UNIQUE_VIOLATION = 'P2002';

const isUniqueViolation = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === UNIQUE_VIOLATION;

@Injectable()
export class PrismaTeamsRepository implements TeamsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTeamDto): Promise<Teams> {
    try {
      return await this.prisma.teams.create({ data });
    } catch (error) {
      if (isUniqueViolation(error)) throw new TeamNameInUseError(data.name);
      throw error;
    }
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

  async update(id: number, data: UpdateTeamDto): Promise<Teams> {
    try {
      return await this.prisma.teams.update({ where: { id }, data });
    } catch (error) {
      if (isUniqueViolation(error) && data.name !== undefined) {
        throw new TeamNameInUseError(data.name);
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    await this.prisma.teams.delete({ where: { id } });
  }
}
