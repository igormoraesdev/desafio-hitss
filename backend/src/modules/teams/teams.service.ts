import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Paginated, paginate } from '../../common/pagination/pagination';
import { Teams } from '../../generated/prisma/client';
import { CreateTeamDto } from './dto/create-team.dto';
import { FindTeamsQueryDto } from './dto/find-teams-query.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import {
  TEAMS_REPOSITORY,
  TeamNameInUseError,
  TeamsRepository,
} from './repositories/teams.repository';

@Injectable()
export class TeamsService {
  constructor(
    @Inject(TEAMS_REPOSITORY) private readonly repository: TeamsRepository,
    @InjectPinoLogger(TeamsService.name) private readonly logger: PinoLogger,
  ) {}

  async create(dto: CreateTeamDto): Promise<Teams> {
    await this.verifyNameIsAvailable(dto.name);
    const team = await this.withNameConflict(() => this.repository.create(dto));
    this.logger.info({ teamId: team.id, teamName: team.name }, 'Time criado');
    return team;
  }

  async findAll(query: FindTeamsQueryDto): Promise<Paginated<Teams>> {
    const filters = query.toFilters();
    this.logger.debug(
      { page: query.page, limit: query.limit, filters },
      'Listando times',
    );
    const result = await this.repository.findAll({
      filters,
      page: query.toPageParams(),
    });
    return paginate(result, query);
  }

  async findOne(id: number): Promise<Teams> {
    const team = await this.repository.findById(id);
    if (!team) {
      this.logger.warn({ teamId: id }, 'Time não encontrado');
      throw new NotFoundException(`Time ${id} não encontrado`);
    }
    return team;
  }

  async update(id: number, dto: UpdateTeamDto): Promise<Teams> {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Informe ao menos um campo para atualizar');
    }
    const team = await this.findOne(id);
    const isRenaming = dto.name !== undefined && dto.name !== team.name;
    if (isRenaming) {
      await this.verifyNameIsAvailable(dto.name!);
    }
    const updated = await this.withNameConflict(() =>
      this.repository.update(id, dto),
    );
    this.logger.info(
      { teamId: id, fields: Object.keys(dto) },
      'Time atualizado',
    );
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.repository.remove(id);
    this.logger.info({ teamId: id }, 'Time removido');
  }

  async ensureAllExist(ids: number[]): Promise<void> {
    const found = await this.repository.findManyByIds(ids);
    const foundIds = new Set(found.map((team) => team.id));
    const missing = ids.filter((id) => !foundIds.has(id));
    if (missing.length > 0) {
      this.logger.warn({ teamIds: missing }, 'Times não encontrados');
      throw new NotFoundException(
        `Times não encontrados: ${missing.join(', ')}`,
      );
    }
  }

  private async withNameConflict<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof TeamNameInUseError) {
        this.logger.warn({ teamName: error.name }, 'Nome de time em uso');
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  private async verifyNameIsAvailable(name: string): Promise<void> {
    const existing = await this.repository.findByName(name);
    if (existing) {
      this.logger.warn(
        { teamName: name, teamId: existing.id },
        'Nome de time em uso',
      );
      throw new ConflictException(`Já existe um time com o nome "${name}"`);
    }
  }
}
