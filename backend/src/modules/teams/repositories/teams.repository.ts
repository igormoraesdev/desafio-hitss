import { PageParams, PageResult } from '../../../common/pagination/pagination';
import { Teams } from '../../../generated/prisma/client';
import { CreateTeamDto } from '../dto/create-team.dto';
import { TeamFilters } from '../dto/find-teams-query.dto';
import { UpdateTeamDto } from '../dto/update-team.dto';

export const TEAMS_REPOSITORY = Symbol('TEAMS_REPOSITORY');

export interface FindTeamsOptions {
  filters: TeamFilters;
  page: PageParams;
}

export interface TeamsRepository {
  create(data: CreateTeamDto): Promise<Teams>;
  findAll(options: FindTeamsOptions): Promise<PageResult<Teams>>;
  findById(id: number): Promise<Teams | null>;
  findByName(name: string): Promise<Teams | null>;
  findManyByIds(ids: number[]): Promise<Teams[]>;
  update(id: number, data: UpdateTeamDto): Promise<Teams>;
  remove(id: number): Promise<void>;
}
